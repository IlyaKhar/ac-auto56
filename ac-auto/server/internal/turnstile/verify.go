package turnstile

import (
	"context"
	"encoding/json"
	"fmt"
	"io"
	"net/http"
	"net/url"
	"strings"
	"time"
)

const siteVerifyURL = "https://challenges.cloudflare.com/turnstile/v0/siteverify"

type verifyResponse struct {
	Success    bool     `json:"success"`
	ErrorCodes []string `json:"error-codes"`
}

// Verify проверяет токен Turnstile на стороне Cloudflare.
// remoteIP опционален (передаём если есть реальный IP клиента).
func Verify(ctx context.Context, secret, token, remoteIP string) error {
	if strings.TrimSpace(secret) == "" {
		return fmt.Errorf("turnstile: пустой секрет")
	}
	if strings.TrimSpace(token) == "" {
		return fmt.Errorf("turnstile: пустой токен")
	}

	form := url.Values{}
	form.Set("secret", secret)
	form.Set("response", token)
	if remoteIP != "" {
		form.Set("remoteip", remoteIP)
	}

	req, err := http.NewRequestWithContext(ctx, http.MethodPost, siteVerifyURL, strings.NewReader(form.Encode()))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/x-www-form-urlencoded")

	client := &http.Client{Timeout: 10 * time.Second}
	res, err := client.Do(req)
	if err != nil {
		return fmt.Errorf("turnstile: запрос: %w", err)
	}
	defer res.Body.Close()

	body, err := io.ReadAll(io.LimitReader(res.Body, 1<<20))
	if err != nil {
		return fmt.Errorf("turnstile: чтение ответа: %w", err)
	}

	var vr verifyResponse
	if err := json.Unmarshal(body, &vr); err != nil {
		return fmt.Errorf("turnstile: json: %w", err)
	}

	if !vr.Success {
		return fmt.Errorf("turnstile: отклонено: %v", vr.ErrorCodes)
	}

	return nil
}
