// Recent public GitHub activity, fetched client-side from the public events API.
(() => {
  const root = document.querySelector("[data-github-activity]");
  if (!root) return;

  const USER = root.dataset.githubActivity;
  const MAX_ITEMS = 8;
  const CACHE_KEY = `gh-activity:${USER}`;
  const CACHE_TTL = 10 * 60 * 1000;
  const fr = document.documentElement.lang === "fr";
  const list = root.querySelector(".activity");

  const L = fr
    ? {
        push: (n) => (n > 1 ? `${n} pushs sur` : "Push sur"),
        create: { repository: "Création du dépôt", branch: "Nouvelle branche dans", tag: "Nouveau tag dans" },
        delete: "Suppression d’une branche dans",
        pr: { opened: "PR ouverte", closed: "PR fermée", merged: "PR fusionnée", reopened: "PR rouverte" },
        prs: { opened: "PR ouvertes", closed: "PR fermées", merged: "PR fusionnées", reopened: "PR rouvertes" },
        review: (n) => (n > 1 ? "Revue des PR" : "Revue de la PR"),
        reviewComment: (n) => (n > 1 ? "Commentaires sur les PR" : "Commentaires sur la PR"),
        issue: { opened: "Ticket ouvert", closed: "Ticket fermé", reopened: "Ticket rouvert" },
        issues: { opened: "Tickets ouverts", closed: "Tickets fermés", reopened: "Tickets rouverts" },
        issueComment: (n) => (n > 1 ? "Commentaires sur les tickets" : "Commentaires sur le ticket"),
        and: "et",
        star: "Étoile sur",
        fork: "Fork de",
        release: "Publication de",
        public: "Passage en open source de",
        other: "Activité sur",
        in: "dans",
        error: "Impossible de charger l’activité pour le moment.",
        empty: "Aucune activité publique récente.",
      }
    : {
        push: (n) => (n > 1 ? `Pushed ${n} times to` : "Pushed to"),
        create: { repository: "Created repository", branch: "New branch in", tag: "New tag in" },
        delete: "Deleted a branch in",
        pr: { opened: "Opened PR", closed: "Closed PR", merged: "Merged PR", reopened: "Reopened PR" },
        prs: { opened: "Opened PRs", closed: "Closed PRs", merged: "Merged PRs", reopened: "Reopened PRs" },
        review: (n) => (n > 1 ? "Reviewed PRs" : "Reviewed PR"),
        reviewComment: (n) => (n > 1 ? "Commented on PRs" : "Commented on PR"),
        issue: { opened: "Opened issue", closed: "Closed issue", reopened: "Reopened issue" },
        issues: { opened: "Opened issues", closed: "Closed issues", reopened: "Reopened issues" },
        issueComment: (n) => (n > 1 ? "Commented on issues" : "Commented on issue"),
        and: "and",
        star: "Starred",
        fork: "Forked",
        release: "Released",
        public: "Open-sourced",
        other: "Activity on",
        in: "in",
        error: "Couldn’t load activity right now.",
        empty: "No recent public activity.",
      };

  const rtf = new Intl.RelativeTimeFormat(fr ? "fr" : "en", { numeric: "auto" });
  function relative(date) {
    const s = (date - Date.now()) / 1000;
    const steps = [[60, "second"], [3600, "minute"], [86400, "hour"], [604800, "day"], [2629800, "week"], [31557600, "month"]];
    let prev = 1;
    for (const [limit, unit] of steps) {
      if (Math.abs(s) < limit) return rtf.format(Math.round(s / prev), unit);
      prev = limit;
    }
    return rtf.format(Math.round(s / 31557600), "year");
  }

  const el = (tag, props = {}, ...children) => {
    const node = Object.assign(document.createElement(tag), props);
    node.append(...children);
    return node;
  };
  const link = (href, text, cls) =>
    el("a", { href, textContent: text, className: cls || "", target: "_blank", rel: "noreferrer" });

  const numberOf = (p) => p.pull_request?.number ?? p.issue?.number ?? p.number;

  // Merge events of the same kind on the same repository, keeping the most recent date.
  function keyOf(e) {
    const p = e.payload || {};
    const action = e.type === "PullRequestEvent" || e.type === "IssuesEvent" ? p.action : "";
    const ref = e.type === "CreateEvent" ? p.ref_type : "";
    return `${e.type}|${e.repo.name}|${action}|${ref}`;
  }

  function group(events) {
    const groups = new Map();
    for (const e of events) {
      const k = keyOf(e);
      let g = groups.get(k);
      if (!g) groups.set(k, (g = { event: e, count: 0, numbers: [] }));
      g.count++;
      if (e.created_at > g.event.created_at) g.event = e;
      const n = numberOf(e.payload || {});
      if (n != null && !g.numbers.includes(n)) g.numbers.push(n);
    }
    return [...groups.values()].sort((x, y) => (x.event.created_at < y.event.created_at ? 1 : -1));
  }

  function describe({ event: e, count, numbers }) {
    const p = e.payload || {};
    const repo = e.repo.name;
    const repoUrl = `https://github.com/${repo}`;
    const repoLink = link(repoUrl, repo, "mono");
    // "#61, #74 and #60" with each number linked.
    const refs = (kind) => {
      const shown = numbers.slice(0, 4);
      const out = [];
      shown.forEach((n, i) => {
        if (i > 0) out.push(i === shown.length - 1 && numbers.length <= 4 ? ` ${L.and} ` : ", ");
        out.push(link(`${repoUrl}/${kind}/${n}`, `#${n}`));
      });
      if (numbers.length > 4) out.push(` +${numbers.length - 4}`);
      return out;
    };
    const many = numbers.length > 1;

    switch (e.type) {
      case "PushEvent":
        return [`${L.push(count)} `, repoLink];
      case "CreateEvent":
        if (p.ref_type === "repository") return [`${L.create.repository} `, repoLink];
        return [`${L.create[p.ref_type] || L.other} `, repoLink];
      case "DeleteEvent":
        return [`${L.delete} `, repoLink];
      case "PullRequestEvent":
        return [`${(many ? L.prs : L.pr)[p.action] || L.other} `, ...refs("pull"), ` ${L.in} `, repoLink];
      case "PullRequestReviewEvent":
        return [`${L.review(numbers.length)} `, ...refs("pull"), ` ${L.in} `, repoLink];
      case "PullRequestReviewCommentEvent":
        return [`${L.reviewComment(numbers.length)} `, ...refs("pull"), ` ${L.in} `, repoLink];
      case "IssuesEvent":
        return [`${(many ? L.issues : L.issue)[p.action] || L.other} `, ...refs("issues"), ` ${L.in} `, repoLink];
      case "IssueCommentEvent":
        // GitHub redirects /issues/N to /pull/N when N is a PR.
        return [`${L.issueComment(numbers.length)} `, ...refs("issues"), ` ${L.in} `, repoLink];
      case "WatchEvent":
        return [`${L.star} `, repoLink];
      case "ForkEvent":
        return [`${L.fork} `, repoLink];
      case "ReleaseEvent":
        return [`${L.release} ${p.release?.tag_name || ""} ${L.in} `, repoLink];
      case "PublicEvent":
        return [`${L.public} `, repoLink];
      default:
        return [`${L.other} `, repoLink];
    }
  }

  function render(events) {
    list.replaceChildren();
    const items = group(events).slice(0, MAX_ITEMS);
    if (!items.length) {
      list.append(el("li", { className: "activity-status", textContent: L.empty }));
      return;
    }
    for (const item of items) {
      const date = new Date(item.event.created_at);
      const time = el("time", {
        className: "activity-date mono",
        dateTime: item.event.created_at,
        title: date.toLocaleString(fr ? "fr-FR" : "en-GB"),
        textContent: relative(date),
      });
      list.append(el("li", { className: "activity-item" }, el("p", {}, ...describe(item)), time));
    }
  }

  function readCache() {
    try {
      const raw = sessionStorage.getItem(CACHE_KEY);
      if (!raw) return null;
      const { at, events } = JSON.parse(raw);
      return Date.now() - at < CACHE_TTL ? events : null;
    } catch {
      return null;
    }
  }

  function writeCache(events) {
    try {
      sessionStorage.setItem(CACHE_KEY, JSON.stringify({ at: Date.now(), events }));
    } catch {}
  }

  const cached = readCache();
  if (cached) {
    render(cached);
    return;
  }

  fetch(`https://api.github.com/users/${USER}/events/public?per_page=50`, {
    headers: { Accept: "application/vnd.github+json" },
  })
    .then((r) => (r.ok ? r.json() : Promise.reject(r.status)))
    .then((events) => {
      // Keep only what render needs, so the cache stays small.
      const slim = events.map(({ type, repo, payload, created_at }) => ({
        type,
        created_at,
        repo: { name: repo.name },
        payload: {
          action: payload.action,
          number: payload.number,
          ref_type: payload.ref_type,
          release: payload.release && { tag_name: payload.release.tag_name },
          pull_request: payload.pull_request && { number: payload.pull_request.number, merged: payload.pull_request.merged },
          issue: payload.issue && { number: payload.issue.number, pull_request: !!payload.issue.pull_request },
        },
      }));
      writeCache(slim);
      render(slim);
    })
    .catch(() => {
      list.replaceChildren(el("li", { className: "activity-status", textContent: L.error }));
    });
})();
