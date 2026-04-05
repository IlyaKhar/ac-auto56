/** Имя события: слушает LeadCaptureModal, вызывают кнопки «оставить заявку» без отдельной страницы. */
export const LEAD_MODAL_OPEN_EVENT = "ac-open-lead-modal";

/** Открыть модалку заявки: serviceId и/или contextLabel попадают в message на бэк. */
export function openLeadCaptureModal(detail = {}) {
  window.dispatchEvent(new CustomEvent(LEAD_MODAL_OPEN_EVENT, { detail }));
}
