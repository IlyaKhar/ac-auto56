package telegram

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"strconv"
	"strings"
	"time"
)

// Client шлёт сообщения через Bot API. Если токен или chat_id пустые, New возвращает nil.
type Client struct {
	token   string
	chatID  string
	httpCli *http.Client
}

// ApplicationPayload — данные заявки для уведомления в чат.
type ApplicationPayload struct {
	ID        int64
	Type      string
	Name      string
	Phone     string
	Email     string
	CarBrand  string
	VIN       string
	ServiceID *int64
	Message   string
}

// New создаёт клиента; при отсутствии настроек возвращает nil (уведомления отключены).
func New(token, chatID string) *Client {
	token = strings.TrimSpace(token)
	chatID = strings.TrimSpace(chatID)
	if token == "" || chatID == "" {
		return nil
	}
	return &Client{
		token:  token,
		chatID: chatID,
		httpCli: &http.Client{
			Timeout: 15 * time.Second,
		},
	}
}

func escapeHTML(s string) string {
	s = strings.ReplaceAll(s, "&", "&amp;")
	s = strings.ReplaceAll(s, "<", "&lt;")
	s = strings.ReplaceAll(s, ">", "&gt;")
	return s
}

const maxTGText = 4000 // запас до лимита 4096

// NotifyNewApplication — форматированное уведомление о новой заявке (HTML).
func (c *Client) NotifyNewApplication(ctx context.Context, p ApplicationPayload) error {
	if c == nil {
		return nil
	}
	var b strings.Builder
	b.WriteString("<b>Новая заявка с сайта</b>\n")
	b.WriteString("ID: <code>")
	b.WriteString(strconv.FormatInt(p.ID, 10))
	b.WriteString("</code>\n")
	b.WriteString("Тип: ")
	b.WriteString(escapeHTML(p.Type))
	b.WriteString("\n")
	b.WriteString("Имя: ")
	b.WriteString(escapeHTML(p.Name))
	b.WriteString("\n")
	b.WriteString("Телефон: ")
	b.WriteString(escapeHTML(p.Phone))
	b.WriteString("\n")
	if p.Email != "" {
		b.WriteString("Email: ")
		b.WriteString(escapeHTML(p.Email))
		b.WriteString("\n")
	}
	if p.CarBrand != "" {
		b.WriteString("Марка: ")
		b.WriteString(escapeHTML(p.CarBrand))
		b.WriteString("\n")
	}
	if p.VIN != "" {
		b.WriteString("VIN: ")
		b.WriteString(escapeHTML(p.VIN))
		b.WriteString("\n")
	}
	if p.ServiceID != nil {
		b.WriteString("service_id: <code>")
		b.WriteString(strconv.FormatInt(*p.ServiceID, 10))
		b.WriteString("</code>\n")
	}
	if p.Message != "" {
		msg := escapeHTML(p.Message)
		if len(msg) > maxTGText-b.Len() {
			msg = msg[:maxTGText-b.Len()-20] + "… (обрезано)"
		}
		b.WriteString("\nСообщение:\n")
		b.WriteString(msg)
	}
	text := b.String()
	if len(text) > 4096 {
		text = text[:4090] + "…"
	}
	return c.sendMessage(ctx, text)
}

type apiResponse struct {
	OK          bool   `json:"ok"`
	Description string `json:"description"`
}

// chatIDJSON — Telegram надёжнее принимает числовой chat_id для супергрупп; @channel остаётся строкой.
func chatIDJSON(chatID string) interface{} {
	chatID = strings.TrimSpace(chatID)
	if chatID == "" {
		return chatID
	}
	n, err := strconv.ParseInt(chatID, 10, 64)
	if err != nil {
		return chatID
	}
	return n
}

func (c *Client) sendMessage(ctx context.Context, text string) error {
	url := fmt.Sprintf("https://api.telegram.org/bot%s/sendMessage", c.token)
	payload := map[string]interface{}{
		"chat_id":                   chatIDJSON(c.chatID),
		"text":                      text,
		"parse_mode":                "HTML",
		"disable_web_page_preview": true,
	}
	body, err := json.Marshal(payload)
	if err != nil {
		return err
	}
	req, err := http.NewRequestWithContext(ctx, http.MethodPost, url, bytes.NewReader(body))
	if err != nil {
		return err
	}
	req.Header.Set("Content-Type", "application/json")
	resp, err := c.httpCli.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(io.LimitReader(resp.Body, 4096))
	var ar apiResponse
	_ = json.Unmarshal(raw, &ar)
	if resp.StatusCode != http.StatusOK || !ar.OK {
		return fmt.Errorf("telegram API: %s: %s", resp.Status, string(raw))
	}
	return nil
}

type getMeResult struct {
	Username string `json:"username"`
}

type getMeResponse struct {
	OK     bool         `json:"ok"`
	Result getMeResult  `json:"result"`
	Desc   string       `json:"description"`
}

// LogStartup проверяет токен (getMe) и пишет в лог, включены ли уведомления — чтобы сразу видеть ошибку.
func LogStartup(ctx context.Context, token, chatID string) {
	token = strings.TrimSpace(token)
	chatID = strings.TrimSpace(chatID)
	if token == "" || chatID == "" {
		log.Print("telegram: уведомления выключены (пустой TELEGRAM_BOT_TOKEN или TELEGRAM_CHAT_ID)")
		return
	}
	nctx, cancel := context.WithTimeout(ctx, 12*time.Second)
	defer cancel()
	url := fmt.Sprintf("https://api.telegram.org/bot%s/getMe", token)
	req, err := http.NewRequestWithContext(nctx, http.MethodGet, url, nil)
	if err != nil {
		log.Printf("telegram: getMe: %v", err)
		return
	}
	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		log.Printf("telegram: getMe запрос: %v (проверь интернет / DNS в контейнере)", err)
		return
	}
	defer resp.Body.Close()
	raw, _ := io.ReadAll(io.LimitReader(resp.Body, 2048))
	var gr getMeResponse
	_ = json.Unmarshal(raw, &gr)
	if resp.StatusCode != http.StatusOK || !gr.OK {
		log.Printf("telegram: getMe не ок — токен неверный или отозван: %s — %s", resp.Status, string(raw))
		return
	}
	log.Printf("telegram: ок, бот @%s; заявки уходят в chat_id=%s", gr.Result.Username, chatID)
	// Супергруппа/канал почти всегда -100…; «-» у личного id не превращает его в группу
	if strings.HasPrefix(chatID, "-") && !strings.HasPrefix(chatID, "-100") {
		log.Printf("telegram: ВНИМАНИЕ: id группы/канала обычно вида -100xxxxxxxxxx. Если в чат пусто — добавь бота в группу, напиши там /start, открой https://api.telegram.org/bot<ТОКЕН>/getUpdates и скопируй chat.id оттуда")
	}
}
