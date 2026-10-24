// Renders the hobby pages from the files in /data. Edit the JSON, not the HTML.
const make = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text) e.textContent = text;
  return e;
};
const media = item => {
  if (!item.src) return make("div", "ph");
  const isVideo = /\.(mp4|webm|mov)$/i.test(item.src);
  const m = document.createElement(isVideo ? "video" : "img");
  m.src = item.src;
  if (isVideo) { m.controls = true; m.muted = true; m.playsInline = true; m.preload = "metadata"; }
  else { m.alt = item.alt || item.text || item.caption || ""; m.loading = "lazy"; }
  return m;
};
const fill = (box, items, build) => {
  if (!items.length) { if (box.parentElement.dataset.group) box.parentElement.hidden = true; return; }
  items.forEach(i => box.appendChild(build(i)));
};

const page = document.body.dataset.page;
fetch("data/" + page + ".json")
  .then(r => r.json())
  .then(items => {
    if (page === "lifing") {
      fill(document.querySelector(".scatter"), items, i => {
        if (i.type === "note") {
          const d = make("div", "memo note"); d.appendChild(make("p", "", i.text)); return d;
        }
        const f = make("figure", "memo");
        f.append(media(i), make("p", "", i.text));
        return f;
      });
    } else if (page === "made-by-me") {
      document.querySelectorAll("[data-group]").forEach(g => {
        fill(g.querySelector(".works"), items.filter(i => i.kind === g.dataset.group), i => {
          const f = make("figure", "work");
          f.append(media(i), make("span", "tag", i.kind), make("figcaption", "", i.caption));
          return f;
        });
      });
    } else if (page === "between-the-pages") {
      document.querySelectorAll("[data-group]").forEach(g => {
        fill(g.querySelector(".pages"), items.filter(i => i.kind === g.dataset.group), i => {
          const a = make("article", "page");
          a.append(make("span", "kind", i.kind), make("strong", "", i.title), make("p", "", i.note));
          return a;
        });
      });
    }
  })
  .catch(() => {
    const w = document.querySelector(".hob");
    w.insertBefore(make("p", "", "Nothing here yet."), w.querySelector(".back"));
  });
