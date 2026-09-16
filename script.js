/* ============================================================
   AVERMONT LEGAL - скрипт страницы.
   Плиты · герой (кадр виден сразу и гаснет по прокрутке, --hf) · кадры практик
   (лист уходит по --open) · кейсы (вкладки / стрелки) · перевод RU/EN
   (?lang= сильнее localStorage, язык по браузеру не угадываем) · меню ·
   бегущая строка юрисдикций · WhatsApp с текстом по практике · форма в WhatsApp.
   Библиотек нет. Обработчики кликов tel/wa - только делегирование в фазе
   захвата, ссылки не перезаписываются в момент клика (совместимость с LeadBot).
   ============================================================ */
(function(){
"use strict";

/* ---------------- КОНТАКТЫ (единственное место) ---------------- */
var CONTACT = {
  phone: "+77077906095",
  phoneView: "+7 707 790 6095",
  wa: "77077906095",
  mail: "rbatykov@avermontlegal.com"
};

var RED = matchMedia("(prefers-reduced-motion: reduce)").matches;
var HAS_IO = typeof IntersectionObserver === "function";
var root = document.documentElement;

/* ---------------- КОНВЕРСИИ GOOGLE ADS ----------------
   Ярлыки задаёт index.html (window.AL_CONV) на этапе рекламы. Переход не блокируем. */
function conv(key){
  var id = (window.AL_CONV || {})[key];
  if (!id || typeof window.gtag !== "function") return;
  window.gtag("event", "conversion", {send_to: id, value: 1.0, currency: "USD"});
}
window.addEventListener("click", function(e){
  var a = e.target.closest ? e.target.closest("a[href]") : null;
  if (!a) return;
  var h = a.getAttribute("href") || "";
  if (h.indexOf("tel:") === 0) conv("phone");
  else if (h.indexOf("wa.me") > -1) conv("contact");
  else if (h.indexOf("mailto:") === 0) conv("mail");
}, true);

/* ---------------- АНГЛИЙСКИЙ СЛОВАРЬ ----------------
   Разметка русская. Ключ отсутствует - строка остаётся русской. */
var EN = {
  "meta.title": "Avermont Legal - business law firm in Almaty: disputes, immigration, AIFC, M&A",
  "meta.desc": "Avermont Legal is a business law firm in Almaty, Kazakhstan. Recovery of substantial debts and commercial disputes, visas and residence permits, AIFC, corporate law and M&A, business abroad. Full service in English and Russian.",
  "meta.ogt": "Avermont Legal - business law firm in Almaty, Kazakhstan",
  "meta.ogd": "Disputes and debt recovery, immigration, AIFC, corporate law and M&A, business abroad. English and Russian.",
  "aria.lang": "Site language", "aria.call": "Call", "aria.menu": "Menu",
  "nav.spory": "Disputes", "nav.migraciya": "Immigration", "nav.za": "International", "nav.korp": "Corporate", "nav.ip": "IP & franchising", "nav.podhod": "Approach", "nav.kontakty": "Contact", "nav.keysy": "Cases", "nav.admin": "Public-law disputes",
  "m.spory": "Disputes and debt recovery", "m.migraciya": "Immigration and visas", "m.aifc": "AIFC", "m.za": "Business abroad", "m.korp": "Corporate law and M&A", "m.ip": "IP and franchising", "m.podhod": "How we work", "m.kontakty": "Contact", "m.keysy": "Case studies", "m.admin": "Administrative and procurement disputes",
  "hero.alt": "Almaty: business district and the Zailiysky Alatau mountains",
  "hero.kick": "Almaty, Kazakhstan · Business law firm · EN / RU",
  "hero.big": "Business law firm",
  "hero.sub": "Disputes, transactions, investment, AIFC and immigration - in Kazakhstan and abroad",
  "hero.lead": "Recovery of substantial debts and commercial litigation, visas and residence permits, AIFC and foreign company formation. 11 years of practice, 7 jurisdictions, full service in English and Russian.",
  "hero.b1": "Discuss your matter", "hero.b2": "Practice areas",
  "cta.wa": "Discuss your matter",
  "p1.kick": "Споры · Взыскание долгов", "p1.h2": "Disputes and <em>debt recovery</em>",
  "p1.l1": "Commercial and corporate disputes, including shareholder and partner conflicts",
  "p1.l2": "Recovery of substantial debts: demand letters, litigation, interim measures, enforcement",
  "p1.l3": "Representation before the courts of Kazakhstan at all levels, up to cassation",
  "p1.l4": "Case strategy before filing: assessment of merits, evidence and risks",
  "p1.note": "We act for businesses in matters of significant value. No consumer or personal cases.",
  "p1.alt": "Boardroom in a business centre overlooking the city", "p1.word": "Disputes",
  "p2.kick": "Визы · Миграция", "p2.h2": "Immigration and <em>work visas</em>",
  "p2.l1": "Work and business visas, including C3 and C5 categories",
  "p2.l2": "Residence permits in Kazakhstan",
  "p2.l3": "Foreign employees, directors and investors: permits, notifications, registration",
  "p2.l4": "End-to-end support for international clients, entirely in English",
  "p2.note": "Timelines and document lists depend on the visa category and citizenship - we confirm them at the first consultation.",
  "p2.alt": "Passport with visa stamps", "p2.word": "Visas",
  "p3.kick": "МФЦА · Международный финансовый центр «Астана»", "p3.h2": "AIFC: incorporation, <em>court and arbitration</em>",
  "p3.l1": "Incorporation in the AIFC and ongoing corporate support",
  "p3.l2": "Litigation before the AIFC Court",
  "p3.l3": "Arbitration at the International Arbitration Centre (IAC)",
  "p3.l4": "Structuring of transactions and holdings under AIFC law, based on English common law",
  "p3.note": "For investors, funds, fintech and holding companies that need an English-law environment inside Kazakhstan.",
  "p3.alt": "Glass facade of a modern building in Astana",
  "p4.kick": "Международные проекты · Трансграничные сделки", "p4.h2": "Business abroad and <em>international projects</em>",
  "p4.l1": "Company formation and support: USA, UAE, China, United Kingdom, Singapore, Hong Kong",
  "p4.l2": "Choice of jurisdiction and tax-efficient structuring",
  "p4.l3": "International market entry and China-related business",
  "p4.l4": "Startups: structuring, fundraising, investment documents",
  "p4.note": "We work with local counsel in each jurisdiction and coordinate the project from Almaty in English and Russian.",
  "p4.alt": "Hong Kong central business district", "p4.word": "Global",
  "geo.kick": "Jurisdictions", "geo.h2": "Where we incorporate and support businesses",
  "geo.lead": "Kazakhstan and the AIFC are our core practice. Abroad, we handle incorporation, banking and tax support through trusted partners, remaining your single point of contact.",
  "geo.c1": "Dubai", "geo.s1": "UAE · Free zone and mainland", "geo.c2": "London", "geo.s2": "United Kingdom · Ltd, LLP",
  "geo.c3": "Singapore", "geo.s3": "Pte. Ltd. · holding structures", "geo.c4": "New York", "geo.s4": "USA · LLC, C-Corp",
  "geo.t1": "Kazakhstan", "geo.t2": "AIFC", "geo.t3": "UAE", "geo.t4": "USA", "geo.t5": "United Kingdom", "geo.t6": "Singapore", "geo.t7": "Hong Kong", "geo.t8": "China",
  "p5.kick": "Корпоративное право · M&A", "p5.h2": "Corporate law and M&amp;A <em>in Kazakhstan</em>",
  "p5.l1": "Incorporation, reorganisation and corporate structuring",
  "p5.l2": "M&amp;A transactions, due diligence, shareholders' and corporate agreements",
  "p5.l3": "Contracts, licences and permits",
  "p5.l4": "Foreign investors and projects in special economic zones (SEZ)",
  "p5.note": "Initial structure and transaction roadmap before the engagement starts, so you see the stages and timelines upfront.",
  "p5.alt": "Signing an agreement", "p5.word": "Deals",
  "p6.kick": "Интеллектуальная собственность · Франчайзинг", "p6.h2": "Intellectual property <em>and franchising</em>",
  "p6.l1": "Trademark registration in Kazakhstan and abroad",
  "p6.l2": "Software and copyright registration",
  "p6.l3": "Franchise packaging: agreements, standards, registration of the rights package",
  "p6.l4": "Enforcement: cease-and-desist letters, negotiations, disputes",
  "p6.note": "We clear the mark for registrability before filing, so you do not pay fees for an application that is bound to be refused.",
  "p6.alt": "Fountain pen on white paper", "p6.word": "Brand",
  "p7.kick": "Административные споры · Госзакупки", "p7.h2": "Administrative and <em>public procurement disputes</em>",
  "p7.l1": "Litigation against state authorities under the Administrative Procedure Code (APPK)",
  "p7.l2": "Challenging actions of private bailiffs and lifting freezes on accounts and assets",
  "p7.l3": "Disputes with national companies",
  "p7.l4": "Public procurement disputes and challenges, including Samruk-Kazyna procurement and the Goszakup system",
  "p7.note": "We represent businesses in disputes with state authorities, national companies and procuring entities.",
  "p7.alt": "Colonnade of a courthouse", "p7.word": "State",
  "cs.kick": "Case studies", "cs.h2": "Case studies: <em>situation, action, result</em>",
  "cs.lead": "Anonymised examples across our practice areas. We do not disclose client names or details that could identify them.",
  "cs.ls": "Situation", "cs.lw": "What we did", "cs.lr": "Result", "cs.more": "How it went",
  "cs.prev": "Previous case", "cs.next": "Next case",
  "cs1.tag": "Disputes and Litigation",
  "cs1.t": "Debt recovery under a supply contract (KZT 340M)",
  "cs1.s": "The client was a supplier of industrial materials working under a framework supply agreement on deferred payment terms. After several successful deliveries, the buyer stopped paying for a large shipment worth KZT 340 million and, once approached, denied ever receiving the goods: no signed acceptance certificate existed, the delivery notes were incomplete, and some documents were missing altogether. The buyer's position rested on the argument that delivery could not be legally proven without properly executed primary documents.",
  "cs1.w": "With the paper trail incomplete, we built the case on a combination of indirect evidence: correspondence between the parties' staff confirming agreed volumes, delivery dates and drop-off locations; records of the client's vehicles entering the buyer's warehouse; testimony from drivers and warehouse staff; the buyer's partial payment for earlier shipments under the same contract; and evidence that the buyer had gone on to resell the goods to third parties - itself proof that the goods had in fact been received. We completed the mandatory pre-trial claim procedure, filed suit, and in court systematically closed down the defendant's attempts to dispute each piece of evidence in isolation, insisting the evidence be assessed as a whole.",
  "cs1.r": "The court found delivery proven and awarded the claim in full. After the judgment took effect, we supported the client through enforcement proceedings until the full amount was actually received on the client's account - not merely a judgment on paper.",
  "cs2.tag": "Corporate Law / AIFC",
  "cs2.t": "Astana Hub accreditation and tax optimization for a startup",
  "cs2.s": "The client was a digital-health startup building a remote patient-clinic engagement platform. The company operated under the general tax regime, which became increasingly costly as revenue grew, and the team had no internal resources to prepare an Astana Hub application or restructure the business to meet accreditation requirements.",
  "cs2.w": "We prepared the full Astana Hub application package from scratch - constituent documents, a description of the technology and business model, and the corporate and financial structure of the project in the format required by the expert panel - and guided the client through every stage of project defense. In parallel, we restructured the company's corporate and contractual arrangements so its activities properly qualified for the Astana Hub preferential tax regime, including adjustments to its stated business activities, intra-group agreements and revenue-recognition practices.",
  "cs2.r": "The startup was accredited as an Astana Hub participant and began legally operating under the preferential tax regime; the restructuring reduced the client's annual tax burden by approximately KZT 24 million.",
  "cs3.tag": "Franchising",
  "cs3.t": "Turnkey franchise packaging",
  "cs3.s": "The client operated a multi-location business (food service/retail) that had proven its model and decided to scale through franchising, but had no legally structured franchise - only internal operating manuals.",
  "cs3.w": "We built the franchise package end-to-end: a franchise/commercial concession agreement compliant with Kazakhstani law, an upfront-fee and royalty model, a brand book and operating standards enforceable against franchisees, a compliance-monitoring mechanism, and grounds for termination in case of breach. Separately, we reviewed and strengthened legal protection of the client's trademark and brand identity so the franchise package rested on protected rights rather than mere usage.",
  "cs3.r": "The client received a fully sales-ready franchise package - from the legal model to the signing-ready document set - and began rolling the business out through franchisees.",
  "cs4.tag": "Disputes and Litigation",
  "cs4.t": "Challenging a private bailiff's actions and lifting asset freezes",
  "cs4.s": "In the course of enforcement proceedings to which the client was not a direct party (or was the good-faith party), a private bailiff froze the client's bank accounts and assets. The freeze effectively paralyzed operations, blocking settlements with counterparties and current payment obligations.",
  "cs4.w": "We assessed the lawfulness and proportionality of the bailiff's actions, prepared and filed a court complaint against the bailiff's conduct, and simultaneously applied to lift the freezing measures as disproportionate and unlawful. Separately, we prepared and pursued a claim for the client's representation costs incurred as a result of the unlawful actions.",
  "cs4.r": "The freezes on the client's accounts and assets were lifted and operations resumed without further delay; the client was additionally awarded the representation costs it had incurred.",
  "cs5.tag": "International Business",
  "cs5.t": "Market entry into the United States for a Kazakhstani company",
  "cs5.s": "The client was a Kazakhstani company that had made a strategic decision to enter the US market but had neither a structure for operating in a foreign jurisdiction nor a way to route cash flows and tax exposure between the two countries without triggering double taxation or currency-control issues.",
  "cs5.w": "We designed and implemented the structure from the ground up: incorporated a US legal entity, built a holding structure linking the US operating company to the Kazakhstani parent, defined the cash-flow model between jurisdictions (dividends, intra-group services, loans), calculated the optimal tax position under both countries' laws and the applicable double-tax treaty, and set up baseline corporate governance and compliance for the new structure.",
  "cs5.r": "The client entered the US market with a fully functioning, legally and financially sound international structure, ready for operations and further scaling.",
  "cs6.tag": "Intellectual Property",
  "cs6.t": "Trademark enforcement against a marketplace infringer",
  "cs6.s": "The client, a manufacturer of branded consumer goods, discovered that a third-party marketplace seller was using a sign confusingly similar to its trademark, misleading buyers about the origin of the goods and diluting the brand's reputation.",
  "cs6.w": "We documented the infringement (test purchase, product-listing screenshots, evidence of the infringer's sales volume), sent a cease-and-desist letter demanding the infringer stop use and pay compensation, and, after the infringer ignored it, filed suit. In parallel, we audited the client's trademark portfolio and filed applications to cover additional Nice Classification classes that had previously been left unprotected.",
  "cs6.r": "The court barred the infringer from further use of the sign and awarded the client compensation for the unlawful use of its trademark; the client's trademark portfolio was expanded and strengthened against future infringement.",
  "cs7.tag": "Immigration Law",
  "cs7.t": "Relocating a foreign team to Almaty",
  "cs7.s": "The client, an international IT company, decided to open a development office in Almaty and relocate more than ten foreign specialists on a tight timeline tied to the office's launch date. Any delay in immigration paperwork would directly push back the team's start date.",
  "cs7.w": "We ran the entire immigration track in parallel: work-permit quotas for the employer, work visas of the appropriate category and residence permits for the whole group of specialists, and support for their family members' documentation. Multiple case files were handled simultaneously, with each authority's processing bottlenecks mapped in advance to avoid downtime.",
  "cs7.r": "All specialists and their family members obtained the required status on time, and the client's new office opened exactly on schedule with no delays caused by immigration matters.",
  "cs8.tag": "Tax Structuring",
  "cs8.t": "Eliminating double taxation across a corporate group",
  "cs8.s": "The client was a group of companies with manufacturing and trading operations spanning both the Kazakhstani and international markets. The group's historical intra-group settlement structure - dividends, royalties and payments for intra-group services between related parties - resulted in the same cash flows being taxed twice and created transfer-pricing exposure.",
  "cs8.w": "We audited the group's existing structure, identified the specific points of double taxation and transfer-pricing non-compliance, and designed a new intra-group settlement model correctly applying the relevant double-tax treaties. Intra-group agreements (services, royalties, loans) were rebuilt to match the new model.",
  "cs8.r": "The group's effective tax burden was reduced, intra-group transactions were brought into line with transfer-pricing requirements, and the previously exposed settlement scheme's reassessment risk was eliminated.",
  "cs9.tag": "Special Economic Zones",
  "cs9.t": "Registering a manufacturing project within a Special Economic Zone",
  "cs9.s": "The client, a manufacturing company, planned to launch a new plant and was considering a site within a special economic zone for the tax and customs benefits, but had no experience obtaining SEZ-participant status or negotiating an operating agreement with the zone's administration.",
  "cs9.w": "We prepared and filed the full application package for SEZ-participant status, aligned the project's described activities and stated investment volume with the requirements applicable to zone residents, and supported negotiation and execution of the operating agreement with the SEZ administration, reviewing its terms for investor risk.",
  "cs9.r": "The client obtained SEZ-participant status and the associated tax and customs benefits, materially improving the project's economics from the investment stage onward, before it reached operating profitability.",
  "cs10.tag": "AIFC and International Arbitration",
  "cs10.t": "AIFC Court proceedings under English law",
  "cs10.s": "The client was party to a commercial contract with a foreign counterparty that contained an arbitration clause in favor of the AIFC's International Arbitration Centre / AIFC Court, with English law as the governing law. The counterparty materially breached its obligations and refused any voluntary settlement.",
  "cs10.w": "We prepared the claim materials and legal position under the applicable English law, and represented the client through every stage of the AIFC Court proceedings - from the exchange of pleadings to oral hearings - building the argument around common-law principles rather than Kazakhstani procedural practice.",
  "cs10.r": "The dispute was resolved in the client's favor; because of the AIFC's international standing, the award is enforceable across multiple jurisdictions, giving the client a real recovery rather than a judgment on paper alone.",
  "op.kick": "Why clients trust us", "op.h2": "Experience advising international and <em>large-scale business</em>",
  "op.lead": "Avermont Legal is not a general-practice firm for every occasion. We are a business law firm for companies, entrepreneurs and investors. Our director has practised for 11 years: transactions, disputes and structures for international and large-scale business.",
  "op.f1": "years of the director's legal practice advising international and large-scale business",
  "op.f2": "jurisdictions: Kazakhstan, UAE, USA, United Kingdom, Singapore, Hong Kong, China",
  "op.f3": "full service in two languages: documents, negotiations, correspondence",
  "op.f4": "English law inside Kazakhstan: incorporation, AIFC Court, IAC arbitration",
  "op.alt": "Glass facade of a business centre",
  "ph.kick": "Approach", "ph.h2": "How we work",
  "ph.lead": "Four steps from the first message to the result. No \"free consultations\" and no promises - assessment, terms and work.",
  "ph.s1": "Enquiry", "ph.d1": "Describe your matter on WhatsApp or in the form below. We reply during business hours: Mon-Fri, 09:00-18:00.",
  "ph.s2": "Assessment", "ph.d2": "We review the documents, assess the prospects and risks, and propose a strategy and action plan.",
  "ph.s3": "Terms", "ph.d3": "Scope, timelines and fees are fixed in the engagement agreement. No hidden charges.",
  "ph.s4": "Work", "ph.d4": "We run the dispute, transaction or project through to the result and keep you informed in English or Russian.",
  "ph.fee": "Fees are quoted individually", "ph.feed": "They depend on the scope of work, the project and the amount in dispute. There is no price list: we assess each matter separately and quote before the work begins.",
  "z.kick": "Enquiry", "z.h2": "Describe your matter - we reply during business hours",
  "z.i1": "Briefly: who you are, what the matter is, what the timeline is",
  "z.i2": "The form opens WhatsApp with a ready message - nothing to retype",
  "z.i3": "Confidential: details are discussed with you only",
  "z.name": "Name", "z.namep": "How should we address you", "z.comp": "Company", "z.compp": "Name or industry",
  "z.phone": "Phone", "z.msg": "Your matter", "z.msgp": "For example: a counterparty has not paid under a supply contract, the amount and the timeline",
  "z.err": "Please fill in your name, phone and the matter.",
  "z.ok": "Thank you. WhatsApp has opened with your message - if the window did not appear, contact us directly: +7 707 790 6095.",
  "z.btn": "Send via WhatsApp", "z.note": "By clicking the button you agree to the processing of the details provided in order to respond to your enquiry.",
  "k.kick": "Contact", "k.h2": "Avermont Legal LLP",
  "k.lead": "Almaty, Kazakhstan. We advise clients across Kazakhstan and abroad - in person, online and in writing, in English and Russian.",
  "k.tel": "Phone and WhatsApp", "k.city": "City", "k.cityv": "Almaty, Kazakhstan", "k.hours": "Business hours", "k.hoursv": "Mon-Fri, 09:00-18:00",
  "k.wa": "Message on WhatsApp", "k.mail": "Send an e-mail", "k.alt": "Almaty: mountains and business districts", "k.word": "Almaty",
  "ftr.c": "&copy; 2026 Avermont Legal LLP · Almaty, Kazakhstan",
  "bar.call": "Call"
};

/* готовые тексты WhatsApp по практикам */
var WA_TXT = {
  ru: {
    hero:      "Здравствуйте! Пишу с сайта Avermont Legal. Кратко о задаче: ",
    spory:     "Здравствуйте! Пишу с сайта Avermont Legal.\nНаправление: споры и взыскание задолженности.\nКратко о ситуации (стороны, сумма, сроки): ",
    migraciya: "Здравствуйте! Пишу с сайта Avermont Legal.\nНаправление: визы и миграция.\nГражданство, цель (работа / бизнес / ВНЖ) и сроки: ",
    aifc:      "Здравствуйте! Пишу с сайта Avermont Legal.\nНаправление: AIFC / МФЦА.\nЗадача (регистрация, спор, арбитраж, структура): ",
    za:        "Здравствуйте! Пишу с сайта Avermont Legal.\nНаправление: бизнес за рубежом.\nЮрисдикция и задача: ",
    admin:     "Здравствуйте! Пишу с сайта Avermont Legal.\nНаправление: административные споры и госзакупки.\nКратко о ситуации (госорган / ЧСИ / закупка, сроки): ",
    korp:      "Здравствуйте! Пишу с сайта Avermont Legal.\nНаправление: корпоративное право и M&A.\nКратко о задаче: ",
    ip:        "Здравствуйте! Пишу с сайта Avermont Legal.\nНаправление: товарные знаки, авторское право, франшиза.\nКратко о задаче: ",
    kontakty:  "Здравствуйте! Пишу с сайта Avermont Legal. Вопрос: "
  },
  en: {
    hero:      "Hello! I am contacting you via the Avermont Legal website. Brief description of my matter: ",
    spory:     "Hello! I am contacting you via the Avermont Legal website.\nPractice area: disputes and debt recovery.\nBrief description (parties, amount, timeline): ",
    migraciya: "Hello! I am contacting you via the Avermont Legal website.\nPractice area: immigration and visas.\nCitizenship, purpose (work / business / residence permit) and timeline: ",
    aifc:      "Hello! I am contacting you via the Avermont Legal website.\nPractice area: AIFC.\nMatter (incorporation, dispute, arbitration, structuring): ",
    za:        "Hello! I am contacting you via the Avermont Legal website.\nPractice area: business abroad.\nJurisdiction and matter: ",
    admin:     "Hello! I am contacting you via the Avermont Legal website.\nPractice area: administrative and public procurement disputes.\nBrief description (authority / bailiff / tender, timeline): ",
    korp:      "Hello! I am contacting you via the Avermont Legal website.\nPractice area: corporate law and M&A.\nBrief description: ",
    ip:        "Hello! I am contacting you via the Avermont Legal website.\nPractice area: trademarks, copyright, franchising.\nBrief description: ",
    kontakty:  "Hello! I am contacting you via the Avermont Legal website. My question: "
  }
};

var TICK = {
  ru: ["Алматы", "Астана · AIFC", "Дубай", "Лондон", "Сингапур", "Гонконг", "Нью-Йорк", "Пекин", "Русский · English"],
  en: ["Almaty", "Astana · AIFC", "Dubai", "London", "Singapore", "Hong Kong", "New York", "Beijing", "English · Russian"]
};

/* ---------------- КОНТАКТЫ ИЗ КОНСТАНТЫ ---------------- */
document.querySelectorAll("[data-tel]").forEach(function(a){ a.href = "tel:" + CONTACT.phone; });
document.querySelectorAll("[data-phone]").forEach(function(el){ el.textContent = CONTACT.phoneView; });

/* ---------------- ПЕРЕВОД ---------------- */
var RU = {};
function snapshot(){
  document.querySelectorAll("[data-i]").forEach(function(el){ if (RU[el.dataset.i] === undefined) RU[el.dataset.i] = el.innerHTML; });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){ RU[el.dataset.iAlt] = el.alt; });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ RU[el.dataset.iAria] = el.getAttribute("aria-label"); });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ RU[el.dataset.iC] = el.getAttribute("content"); });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){ RU[el.dataset.iPh] = el.getAttribute("placeholder"); });
  var t = document.querySelector("title[data-i-t]"); if (t) RU[t.dataset.iT] = t.textContent;
}
function pick(k, en){ return (en && EN[k] !== undefined) ? EN[k] : RU[k]; }
function curLang(){ return root.lang === "en" ? "en" : "ru"; }

function setWaLinks(){
  var L = curLang();
  document.querySelectorAll("[data-wa]").forEach(function(a){
    var t = WA_TXT[L][a.dataset.wa] || WA_TXT[L].hero;
    a.href = "https://wa.me/" + CONTACT.wa + "?text=" + encodeURIComponent(t);
    a.target = "_blank"; a.rel = "noopener";
  });
}

function applyLang(lang){
  var en = lang === "en";
  root.setAttribute("lang", en ? "en" : "ru");
  document.querySelectorAll("[data-i]").forEach(function(el){ var v = pick(el.dataset.i, en); if (v !== undefined) el.innerHTML = v; });
  document.querySelectorAll("[data-i-alt]").forEach(function(el){ var v = pick(el.dataset.iAlt, en); if (v !== undefined) el.alt = v; });
  document.querySelectorAll("[data-i-aria]").forEach(function(el){ var v = pick(el.dataset.iAria, en); if (v !== undefined) el.setAttribute("aria-label", v); });
  document.querySelectorAll("[data-i-c]").forEach(function(el){ var v = pick(el.dataset.iC, en); if (v !== undefined) el.setAttribute("content", v); });
  document.querySelectorAll("[data-i-ph]").forEach(function(el){ var v = pick(el.dataset.iPh, en); if (v !== undefined) el.setAttribute("placeholder", v); });
  var t = document.querySelector("title[data-i-t]");
  if (t) { var tv = pick(t.dataset.iT, en); if (tv !== undefined) t.textContent = tv; }
  var og = document.querySelector('meta[property="og:locale"]');
  if (og) og.setAttribute("content", en ? "en_US" : "ru_RU");
  document.querySelectorAll(".lang button").forEach(function(b){
    var on = b.getAttribute("data-lang") === (en ? "en" : "ru");
    b.classList.toggle("is-active", on);
    b.setAttribute("aria-pressed", on ? "true" : "false");
  });
  try { localStorage.setItem("al-lang", en ? "en" : "ru"); } catch(e){}
  setWaLinks();
  fillTicker();
  requestAnimationFrame(function(){ fitText(); heroKnock(); update(); });
}
/* ?lang= в URL сильнее localStorage: объявление на русском не должно открыть английскую версию и наоборот */
function initLang(){
  var url = new URLSearchParams(location.search).get("lang");
  var saved = null;
  try { saved = localStorage.getItem("al-lang"); } catch(e){}
  var lang = (url === "en" || url === "ru") ? url : (saved === "en" ? "en" : "ru");
  applyLang(lang);
}
document.querySelectorAll(".lang button").forEach(function(b){
  b.addEventListener("click", function(){ applyLang(b.getAttribute("data-lang")); });
});

/* дисплейная строка героя в одну строку на десктопе: ужимаем кегль, пока не влезет */
function fitText(){
  document.querySelectorAll(".h1 .bigw").forEach(function(el){
    el.style.fontSize = "";
    if (getComputedStyle(el).whiteSpace !== "nowrap") return;
    var box = el.parentElement.clientWidth;
    if (!box) return;
    var size = parseFloat(getComputedStyle(el).fontSize), base = size;
    while (el.scrollWidth > box + 1 && size > base * 0.5) {
      size *= 0.95;
      el.style.fontSize = size + "px";
    }
  });
}

/* ---------------- БЕГУЩАЯ СТРОКА ---------------- */
function fillTicker(){
  var el = document.getElementById("ticker"); if (!el) return;
  var list = TICK[curLang()];
  var one = list.map(function(t){ return "<b>" + t + "</b>"; }).join("");
  el.innerHTML = one;
  var w = el.scrollWidth || 1000;
  var need = Math.max(2, Math.ceil((innerWidth * 2) / w) + 1);
  var html = "";
  for (var i = 0; i < need; i++) html += one;
  el.innerHTML = html;
  el.style.setProperty("--tkw", w + "px");
  el.style.setProperty("--tkd", Math.max(30, w / 28) + "s");
}

/* ---------------- КАДРЫ: фон слова = текущий кадр ----------------
   Слово в .word прозрачное, фон - тот же файл, что в img, в той же геометрии
   (cover + --fp). Так фото проступает сквозь буквы без шва. */
function bindFrames(){
  document.querySelectorAll(".frame").forEach(function(f){
    var img = f.querySelector("img"), w = f.querySelector(".word");
    if (!img || !w) return;
    var set = function(){ w.style.setProperty("--fbg", "url(" + (img.currentSrc || img.src) + ")"); };
    set();
    img.addEventListener("load", set);
  });
  var hi = document.getElementById("hero-img");
  if (hi) { heroKnock(); hi.addEventListener("load", heroKnock); }
}
/* Герой: у .big фон - тот же кадр в геометрии cover относительно всего героя,
   сдвинутый на положение самой строки (offsetLeft/Top не зависят от transform интро). */
function heroKnock(){
  var hi = document.getElementById("hero-img"), big = document.querySelector(".h1 .big"), bg = document.querySelector(".hero-bg");
  if (!hi || !big || !bg || !hi.naturalWidth) return;
  var W = bg.clientWidth, H = bg.clientHeight, iw = hi.naturalWidth, ih = hi.naturalHeight;
  var s = Math.max(W / iw, H / ih), sw = iw * s, sh = ih * s;
  var op = (getComputedStyle(hi).objectPosition || "50% 50%").split(" ");
  var fx = parseFloat(op[0]) / 100, fy = parseFloat(op[1] || op[0]) / 100;
  if (isNaN(fx)) fx = .5; if (isNaN(fy)) fy = .5;
  var px = (W - sw) * fx, py = (H - sh) * fy;
  var bx = big.offsetLeft, by = big.offsetTop;
  big.style.setProperty("--hbg", "url(" + (hi.currentSrc || hi.src) + ")");
  big.style.setProperty("--hbs", sw.toFixed(1) + "px " + sh.toFixed(1) + "px");
  big.style.setProperty("--hbp", (px - bx).toFixed(1) + "px " + (py - by).toFixed(1) + "px");
  big.style.setProperty("--hgs", W + "px " + H + "px");
  big.style.setProperty("--hgp", (-bx) + "px " + (-by) + "px");
}

var rsTimer;
addEventListener("resize", function(){
  update();
  clearTimeout(rsTimer);
  rsTimer = setTimeout(function(){ fillTicker(); fitText(); bindFrames(); update(); }, 200);
});
if (document.fonts && document.fonts.ready) document.fonts.ready.then(function(){ fillTicker(); fitText(); heroKnock(); update(); });

/* ---------------- МЕНЮ ---------------- */
var burger = document.getElementById("burger");
var mnav = document.getElementById("mnav");
function closeMenu(){
  document.body.classList.remove("menu-open");
  if (burger) burger.setAttribute("aria-expanded", "false");
}
if (burger) burger.addEventListener("click", function(){
  var open = document.body.classList.toggle("menu-open");
  burger.setAttribute("aria-expanded", open ? "true" : "false");
});
if (mnav) mnav.addEventListener("click", function(e){ if (e.target.closest("a")) closeMenu(); });
addEventListener("keydown", function(e){ if (e.key === "Escape") closeMenu(); });

/* ---------------- ЯКОРЯ ---------------- */
var HH = function(){ return parseFloat(getComputedStyle(root).getPropertyValue("--hh")) || 72; };
document.addEventListener("click", function(e){
  var a = e.target.closest('a[href^="#"]'); if (!a) return;
  var id = a.getAttribute("href").slice(1); if (!id) return;
  var t = document.getElementById(id); if (!t) return;
  e.preventDefault();
  closeMenu();
  var top = t.getBoundingClientRect().top + scrollY - (t.classList.contains("pw") ? 0 : HH() + 10);
  scrollTo({ top: Math.max(0, top), behavior: RED ? "auto" : "smooth" });
  try { history.pushState(null, "", "#" + id); } catch(err){}
});

/* ---------------- ШАПКА ---------------- */
var hdr = document.getElementById("hdr");
function hdrState(){
  if (!hdr) return;
  var solid = scrollY > 40;
  hdr.classList.toggle("solid", solid);
  hdr.classList.toggle("dark", !solid);  /* вверху страницы под шапкой тёмный кадр героя */
}

/* ---------------- ПЛИТЫ, ГЕРОЙ, КАДРЫ ----------------
   Один слушатель scroll через rAF. На .pw пишем --enter/--exit/--stay;
   на герое --hf (кадр: 0 виден полностью … 1 погашен);
   на каждом .frame - --open по его собственному положению во вьюпорте. */
function clamp(v){ return v < 0 ? 0 : (v > 1 ? 1 : v); }
function easeOut(t){ return 1 - Math.pow(1 - t, 3); }
function easeInOut(t){ return t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2; }
var pws = [].slice.call(document.querySelectorAll(".pw"));
var frames = [].slice.call(document.querySelectorAll(".frame"));
var heroPw = document.getElementById("top");
var hero = document.getElementById("hero");
var bar = document.getElementById("bar");
var kont = document.getElementById("kontakty");
/* ?hf=0.5 / ?open=0.5 в URL - только для проверки промежуточных фаз (checks/) */
var DBG = new URLSearchParams(location.search);
var dbgHf = parseFloat(DBG.get("hf")), dbgOpen = parseFloat(DBG.get("open"));

function heroFade(stay){
  var hf = isNaN(dbgHf) ? easeInOut(clamp(stay / .85)) : dbgHf;
  heroPw.style.setProperty("--hf", hf.toFixed(4));
}
function update(){
  var H = innerHeight || root.clientHeight;
  /* без плит (reduced motion, проверочные копии) значения задаёт CSS: лист снят, кадры открыты */
  if (root.classList.contains("no-plate")) {
    hdrState();
    if (bar) bar.classList.toggle("show", scrollY > H * 0.55 && !(kont && kont.getBoundingClientRect().top < H * 0.6));
    return;
  }
  pws.forEach(function(pw){
    var r = pw.getBoundingClientRect();
    var enter = clamp(1 - r.top / H);
    var exit  = clamp(1 - r.bottom / H);
    var stay  = r.height > H + 1 ? clamp(-r.top / (r.height - H)) : enter;
    pw.style.setProperty("--enter", enter.toFixed(3));
    pw.style.setProperty("--exit",  exit.toFixed(3));
    pw.style.setProperty("--stay",  stay.toFixed(3));
    pw.classList.toggle("gone", exit >= 1);
    pw.classList.toggle("on", enter > 0.6);
    if (pw === heroPw) heroFade(stay);
  });
  frames.forEach(function(f){
    var r = f.getBoundingClientRect();
    var e = clamp(1 - r.top / H);                       /* верх кадра вошёл во вьюпорт */
    var open = !isNaN(dbgOpen) ? dbgOpen : easeOut(clamp((e - .22) / .5));
    f.style.setProperty("--open", open.toFixed(3));
  });
  hdrState();
  var onKont = kont && kont.getBoundingClientRect().top < H * 0.6;
  if (bar) bar.classList.toggle("show", scrollY > H * 0.55 && !onKont);
}
if (RED) {
  root.classList.add("no-plate");
  root.classList.add("no-intro");
  if (hero) hero.classList.add("on");
  addEventListener("scroll", function(){ hdrState(); if (bar) bar.classList.toggle("show", scrollY > innerHeight * 0.55); }, {passive:true});
  hdrState();
} else {
  var tick = false;
  addEventListener("scroll", function(){
    if (tick) return; tick = true;
    requestAnimationFrame(function(){ tick = false; update(); });
  }, {passive:true});
  addEventListener("load", update);
  /* интро: кадр виден сразу, текст проявляется снизу */
  update();
  requestAnimationFrame(function(){ requestAnimationFrame(function(){ if (hero) hero.classList.add("on"); }); });
}
[1500, 3000, 5000].forEach(function(ms){ setTimeout(function(){ heroKnock(); update(); }, ms); });
window.plateSync = function(){ if (hero) hero.classList.add("on"); update(); };
addEventListener("hashchange", function(){ root.classList.add("no-intro"); });

/* ---------------- ПОЯВЛЕНИЕ В КАТАЛОЖНЫХ СЕКЦИЯХ ---------------- */
if (HAS_IO) {
  if (!RED) root.classList.add("js");
  var io = new IntersectionObserver(function(es){
    es.forEach(function(e){ if (e.isIntersecting){ e.target.classList.add("in"); io.unobserve(e.target); } });
  }, {threshold:.08, rootMargin:"0px 0px -6% 0px"});
  document.querySelectorAll(".rv").forEach(function(el){ io.observe(el); });
  setTimeout(function(){ document.querySelectorAll(".rv:not(.in)").forEach(function(el){
    if (el.getBoundingClientRect().top < innerHeight) el.classList.add("in");
  }); }, 1500);
} else {
  document.querySelectorAll(".rv").forEach(function(el){ el.classList.add("in"); });
}

/* ---------------- КЕЙСЫ ----------------
   Десктоп: вкладки слева, кейс справа. Узкий экран: вкладки скрыты, один кейс,
   «Как это было» раскрывает ситуацию и действия. Стрелки листают на любой ширине. */
var cases = [].slice.call(document.querySelectorAll(".case"));
var ctabs = [].slice.call(document.querySelectorAll(".ct"));
var carr = [].slice.call(document.querySelectorAll(".ca"));
var cur = 0;
function showCase(i, focusTab){
  if (i < 0 || i >= cases.length) return;
  var moved = i !== cur;
  cur = i;
  cases.forEach(function(c, k){
    c.hidden = k !== i;
    c.classList.toggle("is-on", k === i);
    if (k !== i) { c.classList.remove("open"); var mb = c.querySelector(".case-more"); if (mb) mb.setAttribute("aria-expanded", "false"); }
  });
  ctabs.forEach(function(t, k){
    t.classList.toggle("is-on", k === i);
    t.setAttribute("aria-selected", k === i ? "true" : "false");
    t.tabIndex = k === i ? 0 : -1;
  });
  if (focusTab && ctabs[i]) ctabs[i].focus();
  carr.forEach(function(b){
    var d = +b.dataset.dir;
    b.disabled = (d < 0 && i === 0) || (d > 0 && i === cases.length - 1);
  });
  /* верх кейса ушёл под шапку - подтянуть, без плавной прокрутки (замер и якоря не ломаются) */
  var panel = document.querySelector(".case-panel");
  if (moved && panel) {
    var top = panel.getBoundingClientRect().top;
    if (top < HH()) scrollTo({ top: scrollY + top - HH() - 12, behavior: "auto" });
  }
}
ctabs.forEach(function(t, k){
  t.addEventListener("click", function(){ showCase(k); });
  t.addEventListener("keydown", function(e){
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); showCase(Math.min(cur + 1, cases.length - 1), true); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); showCase(Math.max(cur - 1, 0), true); }
  });
});
carr.forEach(function(b){ b.addEventListener("click", function(){ showCase(cur + (+b.dataset.dir)); }); });
cases.forEach(function(c){
  var mb = c.querySelector(".case-more"); if (!mb) return;
  mb.addEventListener("click", function(){
    var open = c.classList.toggle("open");
    mb.setAttribute("aria-expanded", open ? "true" : "false");
  });
});

/* ---------------- ФОРМА → WhatsApp ---------------- */
var form = document.getElementById("form");
if (form) form.addEventListener("submit", function(e){
  e.preventDefault();
  var ok = document.getElementById("fmok"), err = document.getElementById("fmerr");
  if (form.website && form.website.value) return;          /* honeypot */
  var name = form.name.value.trim(), comp = form.company.value.trim(), phone = form.phone.value.trim(), msg = form.msg.value.trim();
  if (!name || phone.replace(/\D/g, "").length < 10 || !msg) { err.hidden = false; ok.hidden = true; return; }
  err.hidden = true;
  var L = curLang();
  var t = L === "en"
    ? "Hello! Enquiry from the Avermont Legal website.\nName: " + name + (comp ? "\nCompany: " + comp : "") + "\nPhone: " + phone + "\nMatter: " + msg
    : "Здравствуйте! Заявка с сайта Avermont Legal.\nИмя: " + name + (comp ? "\nКомпания: " + comp : "") + "\nТелефон: " + phone + "\nСуть вопроса: " + msg;
  ok.hidden = false;
  conv("lead");
  window.open("https://wa.me/" + CONTACT.wa + "?text=" + encodeURIComponent(t), "_blank", "noopener");
});

/* ---------------- СТАРТ ---------------- */
snapshot();
bindFrames();
initLang();
fillTicker();
fitText();
hdrState();
})();
