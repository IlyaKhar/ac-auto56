package service

import (
	"context"
	"errors"
	"strings"

	"github.com/jackc/pgx/v5"

	"github.com/IlyaKhar/ac-auto56/server/internal/repository"
)

var (
	ErrApplicationNotFound = errors.New("заявка не найдена")
	ErrInvalidAppStatus    = errors.New("некорректный статус заявки")
	ErrAssigneeNotStaff    = errors.New("назначаемый пользователь не найден или не сотрудник")
	ErrEmptyComment        = errors.New("пустой комментарий")
)

// ApplicationStaffService — список/патч/комментарии для moderator и admin.
type ApplicationStaffService struct {
	apps  *repository.ApplicationRepository
	users *repository.UserRepository
}

func NewApplicationStaffService(apps *repository.ApplicationRepository, users *repository.UserRepository) *ApplicationStaffService {
	return &ApplicationStaffService{apps: apps, users: users}
}

func validAppStatus(s string) bool {
	switch s {
	case "new", "in_progress", "completed", "rejected":
		return true
	default:
		return false
	}
}

func assignEqual(a, b *int64) bool {
	if a == nil && b == nil {
		return true
	}
	if a == nil || b == nil {
		return false
	}
	return *a == *b
}

// ListApplications — фильтры и пагинация.
func (s *ApplicationStaffService) ListApplications(ctx context.Context, f repository.StaffApplicationFilter) ([]repository.StaffApplication, error) {
	return s.apps.ListStaffApplications(ctx, f)
}

// ListStaffRefs — активные moderator/admin для выбора менеджера в заявке.
func (s *ApplicationStaffService) ListStaffRefs(ctx context.Context) ([]repository.StaffUserRef, error) {
	return s.users.ListActiveStaffRefs(ctx)
}

// ApplicationDetail — заявка + комментарии + история.
type ApplicationDetail struct {
	Application repository.StaffApplication   `json:"application"`
	Comments    []repository.StaffComment      `json:"comments"`
	History     []repository.StaffHistoryEvent `json:"history"`
}

func (s *ApplicationStaffService) GetDetail(ctx context.Context, id int64) (*ApplicationDetail, error) {
	app, err := s.apps.GetStaffApplication(ctx, id)
	if err != nil {
		return nil, err
	}
	if app == nil {
		return nil, ErrApplicationNotFound
	}
	comments, err := s.apps.ListApplicationComments(ctx, id)
	if err != nil {
		return nil, err
	}
	hist, err := s.apps.ListApplicationHistory(ctx, id)
	if err != nil {
		return nil, err
	}
	return &ApplicationDetail{
		Application: *app,
		Comments:    comments,
		History:     hist,
	}, nil
}

// PatchStaffApplication — частичное обновление (merge с текущими значениями).
type PatchStaffApplication struct {
	Status            *string
	AssignedManagerID *int64
	ClearAssigned     bool
}

func (s *ApplicationStaffService) PatchApplication(ctx context.Context, actorID, id int64, p PatchStaffApplication) error {
	cur, err := s.apps.GetStaffApplication(ctx, id)
	if err != nil {
		return err
	}
	if cur == nil {
		return ErrApplicationNotFound
	}

	newStatus := cur.Status
	if p.Status != nil {
		ns := strings.TrimSpace(*p.Status)
		if !validAppStatus(ns) {
			return ErrInvalidAppStatus
		}
		newStatus = ns
	}

	var newAssign *int64
	if p.ClearAssigned {
		newAssign = nil
	} else if p.AssignedManagerID != nil {
		ok, err := s.users.IsActiveStaff(ctx, *p.AssignedManagerID)
		if err != nil {
			return err
		}
		if !ok {
			return ErrAssigneeNotStaff
		}
		newAssign = p.AssignedManagerID
	} else {
		newAssign = cur.AssignedManagerID
	}

	if newStatus == cur.Status && assignEqual(newAssign, cur.AssignedManagerID) {
		return nil
	}

	if err := s.apps.UpdateApplicationStaff(ctx, id, newStatus, newAssign); err != nil {
		if errors.Is(err, pgx.ErrNoRows) {
			return ErrApplicationNotFound
		}
		return err
	}

	actor := actorID
	if newStatus != cur.Status {
		_ = s.apps.AddApplicationHistory(ctx, id, &actor, "status_changed", map[string]string{
			"from": cur.Status,
			"to":   newStatus,
		})
	}
	if !assignEqual(cur.AssignedManagerID, newAssign) {
		var from any
		if cur.AssignedManagerID != nil {
			from = *cur.AssignedManagerID
		}
		var to any
		if newAssign != nil {
			to = *newAssign
		}
		_ = s.apps.AddApplicationHistory(ctx, id, &actor, "assigned_changed", map[string]any{
			"from": from,
			"to":   to,
		})
	}

	return nil
}

// AddComment — комментарий + запись в истории.
func (s *ApplicationStaffService) AddComment(ctx context.Context, actorID, applicationID int64, body string) (commentID int64, err error) {
	body = strings.TrimSpace(body)
	if body == "" {
		return 0, ErrEmptyComment
	}
	cur, err := s.apps.GetStaffApplication(ctx, applicationID)
	if err != nil {
		return 0, err
	}
	if cur == nil {
		return 0, ErrApplicationNotFound
	}
	ok, err := s.users.IsActiveStaff(ctx, actorID)
	if err != nil {
		return 0, err
	}
	if !ok {
		return 0, ErrAssigneeNotStaff
	}
	cid, err := s.apps.AddApplicationComment(ctx, applicationID, actorID, body)
	if err != nil {
		return 0, err
	}
	actor := actorID
	_ = s.apps.AddApplicationHistory(ctx, applicationID, &actor, "comment_added", map[string]any{
		"comment_id": cid,
		"preview":    truncateRunes(body, 120),
	})
	return cid, nil
}

func truncateRunes(s string, n int) string {
	r := []rune(s)
	if len(r) <= n {
		return s
	}
	return string(r[:n]) + "…"
}
