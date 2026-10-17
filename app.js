(() => {
  "use strict";

  const content = window.AASA_CONTENT;
  const get_element = (id) => document.getElementById(id);

  // use text content so editable copy is always treated as text
  function create_element(tag, class_name, text) {
    const element = document.createElement(tag);
    if (class_name) element.className = class_name;
    if (text !== undefined) element.textContent = text;
    return element;
  }

  // local noon keeps date only values on the intended calendar day
  const parse_date = (date) => new Date(`${date}T12:00:00`);
  const format_date = (date, options) =>
    date.toLocaleDateString("en-US", options);
  const events = [...content.events].sort((first, second) =>
    first.date.localeCompare(second.date),
  );

  // crop the display window while keeping the original image pixels intact
  function apply_image_crop(image, crop) {
    const width = crop.width || crop.size;
    const height = crop.height || crop.size;
    image.style.width = (crop.source_width / width) * 100 + "%";
    image.style.left = (-crop.x / width) * 100 + "%";
    image.style.top = (-crop.y / height) * 100 + "%";
  }

  function render_page_details() {
    const text_fields = {
      "hero-title": "heroTitle",
      "hero-description": "heroDescription",
      mission: "mission",
      welcome: "welcome",
      semester: "semester",
      "events-note": "eventsNote",
      "officer-note": "officerNote",
      "contact-message": "contactMessage",
    };
    for (const [id, key] of Object.entries(text_fields)) {
      get_element(id).textContent = content[key];
    }
    document.querySelectorAll(".instagram-link").forEach((link) => {
      link.href = content.instagram;
    });

    // keep the placeholders when optional contact details or images are missing
    if (content.logo) {
      document.querySelectorAll(".logo-space").forEach((container) => {
        const image = container.querySelector(".club-logo");
        const frame = container.querySelector(".logo-frame");
        image.src = content.logo;
        image.hidden = false;
        if (content.logo_crop) {
          frame.classList.add("image-crop");
          apply_image_crop(image, content.logo_crop);
        }
        frame.hidden = false;
        container.querySelector(".logo-placeholder").hidden = true;
      });
    }
    if (content.email) {
      get_element("email-link").hidden = false;
      get_element("email-link").href = `mailto:${content.email}`;
      get_element("email-label").textContent = content.email;
    }
  }

  function render_events() {
    events.forEach((event) => {
      const event_date = parse_date(event.date);
      const row = create_element("article", "event-row");
      const date_block = create_element("div", "date-block");
      date_block.append(
        create_element(
          "span",
          "",
          format_date(event_date, { month: "short" }).toUpperCase(),
        ),
        create_element("strong", "", event_date.getDate()),
      );
      const details = create_element("div");
      details.append(
        create_element("h3", "", event.title),
        create_element(
          "p",
          "",
          `${format_date(event_date, { weekday: "short" })} · ${event.time} · ${event.location}`,
        ),
      );
      row.append(date_block, details);
      get_element("event-list").append(row);
    });
    if (!events.length) {
      get_element("event-list").append(
        create_element("p", "", "New meeting dates will be announced soon."),
      );
    }
  }

  // use the campus timezone and open the current month without freezing the date
  const date_parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).formatToParts(new Date());
  const current_date = Object.fromEntries(
    date_parts.map((part) => [part.type, part.value]),
  );
  const today_key =
    current_date.year + "-" + current_date.month + "-" + current_date.day;
  let displayed_month = new Date(
    Number(current_date.year),
    Number(current_date.month) - 1,
    1,
  );

  function select_calendar_day(button, date, day_events) {
    document.querySelectorAll("#calendar-days button").forEach((day_button) => {
      day_button.setAttribute("aria-pressed", "false");
    });
    button.setAttribute("aria-pressed", "true");
    get_element("selected-event").textContent = day_events
      .map(
        (event) =>
          `${event.title} · ${format_date(date, { month: "short", day: "numeric" })} · ${event.time} · ${event.location}`,
      )
      .join(" / ");
  }

  function render_calendar() {
    const calendar_days = get_element("calendar-days");
    get_element("calendar-title").textContent = format_date(displayed_month, {
      month: "long",
      year: "numeric",
    });
    calendar_days.replaceChildren();
    get_element("selected-event").textContent =
      "Select a highlighted date to see event details.";

    // empty cells align the first date with its weekday
    for (let weekday = 0; weekday < displayed_month.getDay(); weekday++) {
      calendar_days.append(create_element("span"));
    }
    const year = displayed_month.getFullYear();
    const month_index = displayed_month.getMonth();
    const days_in_month = new Date(year, month_index + 1, 0).getDate();

    for (let day = 1; day <= days_in_month; day++) {
      const date = new Date(year, month_index, day);
      const day_events = events.filter((event) => {
        const event_date = parse_date(event.date);
        return (
          event_date.getFullYear() === year &&
          event_date.getMonth() === month_index &&
          event_date.getDate() === day
        );
      });
      const cell = create_element(
        day_events.length ? "button" : "span",
        "",
        day,
      );

      const date_key =
        year +
        "-" +
        String(month_index + 1).padStart(2, "0") +
        "-" +
        String(day).padStart(2, "0");
      if (date_key === today_key) cell.setAttribute("aria-current", "date");

      // only event dates are interactive and announced as buttons
      if (day_events.length) {
        cell.type = "button";
        cell.setAttribute(
          "aria-label",
          `${format_date(date, { month: "long", day: "numeric", year: "numeric" })}: ${day_events.map((event) => event.title).join(", ")}`,
        );
        cell.setAttribute("aria-pressed", "false");
        cell.addEventListener("click", () =>
          select_calendar_day(cell, date, day_events),
        );
      }
      calendar_days.append(cell);
    }
  }

  function change_month(offset) {
    displayed_month = new Date(
      displayed_month.getFullYear(),
      displayed_month.getMonth() + offset,
      1,
    );
    render_calendar();
  }

  function render_announcements() {
    content.announcements.forEach((announcement) => {
      const card = create_element("article", "announcement");
      card.append(
        create_element("p", "eyebrow", announcement.label),
        create_element("h3", "", announcement.title),
        create_element("p", "", announcement.text),
      );
      get_element("announcement-list").append(card);
    });
  }

  function render_officers() {
    content.officers.forEach((officer) => {
      const card = create_element("article", "officer");
      if (officer.photo) {
        const photo = create_element("img", "officer-photo");
        photo.src = officer.photo;
        photo.alt = officer.name;
        photo.loading = "lazy";
        if (officer.crop) {
          const frame = create_element("div", "officer-photo image-crop");
          frame.style.aspectRatio =
            officer.crop.width + " / " + officer.crop.height;
          photo.className = "";
          apply_image_crop(photo, officer.crop);
          frame.append(photo);
          card.append(frame);
        } else {
          card.append(photo);
        }
      } else {
        const placeholder = create_element("div", "officer-placeholder");
        placeholder.append(
          create_element("span", "", "aasa"),
          create_element("small", "", "Photo coming soon"),
        );
        card.append(placeholder);
      }
      card.append(
        create_element("h3", "", officer.name),
        create_element("p", "role", officer.role),
      );
      const description = create_element("div", "officer-description");
      description.append(
        create_element("p", "officer-year", officer.year),
        create_element("p", "", officer.major),
      );
      if (officer.study)
        description.append(create_element("p", "", officer.study));
      description.append(
        create_element("p", "officer-hometown", "From " + officer.hometown),
      );
      card.append(description);
      get_element("officer-list").append(card);
    });
  }

  function render_gallery() {
    const gallery = get_element("gallery-list");
    const files = window.AASA_GALLERY || [];
    if (!files.length) {
      gallery.append(create_element("p", "", "Photos coming soon."));
      return;
    }

    // a shared preview follows the pointer without blocking the collage beneath it
    const preview = create_element("div", "gallery-preview");
    const preview_image = create_element("img");
    preview.hidden = true;
    preview.setAttribute("aria-hidden", "true");
    preview.append(preview_image);
    document.body.append(preview);
    const hover_available = window.matchMedia(
      "(hover: hover) and (pointer: fine)",
    );
    let active_tile = null;

    function hide_preview() {
      preview.hidden = true;
      active_tile = null;
    }

    function position_preview(x, y) {
      const bounds = preview.getBoundingClientRect();
      const left =
        x + bounds.width + 20 < window.innerWidth
          ? x + 20
          : x - bounds.width - 20;
      const top =
        y + bounds.height + 20 < window.innerHeight
          ? y + 20
          : y - bounds.height - 20;
      preview.style.left =
        Math.max(12, Math.min(left, window.innerWidth - bounds.width - 12)) +
        "px";
      preview.style.top =
        Math.max(12, Math.min(top, window.innerHeight - bounds.height - 12)) +
        "px";
    }

    function show_preview(tile, image, x, y) {
      if (!image.complete || !image.naturalWidth) return;
      active_tile = tile;
      preview_image.src = image.src;
      preview_image.alt = image.alt;
      const ratio = image.naturalWidth / image.naturalHeight;
      const width = Math.min(
        320,
        window.innerWidth - 24,
        Math.min(420, window.innerHeight - 40) * ratio,
      );
      preview.style.width = width + "px";
      preview.style.height = width / ratio + "px";
      preview.hidden = false;
      position_preview(x, y);
    }

    // a dialog gives touch and keyboard users the same full image view
    const dialog = create_element("dialog", "gallery-dialog");
    dialog.setAttribute("aria-label", "Enlarged gallery photo");
    const close = create_element("button", "gallery-close", "Close ×");
    close.type = "button";
    const full_image = create_element("img");
    dialog.append(close, full_image);
    document.body.append(dialog);
    close.addEventListener("click", () => dialog.close());
    dialog.addEventListener("click", (event) => {
      if (event.target === dialog) dialog.close();
    });

    files.forEach((filename) => {
      const details =
        content.gallery.find((photo) => photo.file === filename) || {};
      const tile = create_element("button", "gallery-tile");
      tile.type = "button";
      const image = create_element("img");
      image.alt =
        details.alt || filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
      tile.setAttribute("aria-label", "Enlarge photo: " + image.alt);
      image.loading = "lazy";
      image.decoding = "async";
      image.addEventListener("load", () => {
        tile.style.setProperty(
          "--photo-ratio",
          image.naturalWidth / image.naturalHeight,
        );
      });
      image.addEventListener("error", () => {
        if (active_tile === tile) hide_preview();
        tile.hidden = true;
      });
      image.src = "assets/gallery/" + encodeURIComponent(filename);
      tile.append(image);
      gallery.append(tile);
      tile.addEventListener("pointerenter", (event) => {
        if (hover_available.matches && event.pointerType !== "touch") {
          show_preview(tile, image, event.clientX, event.clientY);
        }
      });
      tile.addEventListener("pointermove", (event) => {
        if (active_tile === tile)
          position_preview(event.clientX, event.clientY);
      });
      tile.addEventListener("pointerleave", hide_preview);
      tile.addEventListener("focus", () => {
        if (!tile.matches(":focus-visible")) return;
        const bounds = tile.getBoundingClientRect();
        show_preview(tile, image, bounds.right, bounds.top);
      });
      tile.addEventListener("blur", hide_preview);
      tile.addEventListener("click", () => {
        hide_preview();
        full_image.src = image.src;
        full_image.alt = image.alt;
        dialog.showModal();
      });
    });
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") hide_preview();
    });
    window.addEventListener("scroll", hide_preview, { passive: true });
    window.addEventListener("resize", hide_preview);
  }

  function render_quotes() {
    if (!content.quotes.length) {
      get_element("quote-list").append(
        create_element("p", "empty-quotes", content.quotesEmpty),
      );
      return;
    }
    content.quotes.forEach((quote) => {
      const blockquote = create_element("blockquote", "", `“${quote.text}”`);
      blockquote.append(
        create_element(
          "cite",
          "",
          `${quote.name}${quote.detail ? " · " + quote.detail : ""}`,
        ),
      );
      get_element("quote-list").append(blockquote);
    });
  }

  // deferred scripts run after the page markup is ready
  render_page_details();
  render_events();
  render_calendar();
  render_announcements();
  render_officers();
  render_gallery();
  render_quotes();
  get_element("previous-month").onclick = () => change_month(-1);
  get_element("next-month").onclick = () => change_month(1);
})();
