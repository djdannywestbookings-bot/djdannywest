"""
Generate the DFW Wedding DJ Pricing & Planning Guide PDF.

Outputs:
  public/guides/dfw-wedding-dj-guide.pdf

This is the lead magnet served from /wedding-dj-guide.
Run from repo root: python3 scripts/generate-wedding-guide.py
"""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER, TA_LEFT
from reportlab.lib.pagesizes import LETTER
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import inch
from reportlab.pdfgen import canvas
from reportlab.platypus import (
    BaseDocTemplate,
    Frame,
    NextPageTemplate,
    PageBreak,
    PageTemplate,
    Paragraph,
    Spacer,
    Table,
    TableStyle,
)

# Brand palette (approximated from globals.css)
NIGHT = colors.HexColor("#0A0907")
CREAM = colors.HexColor("#F5F1EA")
CREAM_SOFT = colors.HexColor("#EDE6DA")
LINE = colors.HexColor("#E5DDD0")
EMBER = colors.HexColor("#FF4D1F")
INK = colors.HexColor("#111111")
MUTED = colors.HexColor("#6E665D")

PAGE_W, PAGE_H = LETTER
MARGIN = 0.85 * inch


def cover_page(c: canvas.Canvas, doc):
    """First page: full-bleed night background with ember accent and title block."""
    c.saveState()
    # Background
    c.setFillColor(NIGHT)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # Ember vertical bar
    c.setFillColor(EMBER)
    c.rect(MARGIN, PAGE_H - 1.4 * inch, 36, 2, stroke=0, fill=1)

    # Eyebrow
    c.setFillColor(CREAM)
    c.setFont("Helvetica", 9)
    c.drawString(MARGIN, PAGE_H - 1.7 * inch, "DJ DANNY WEST  ·  GUIDE")

    # Big title (split across 3 lines for editorial feel)
    c.setFillColor(CREAM)
    c.setFont("Times-Italic", 60)
    c.drawString(MARGIN, PAGE_H - 3.0 * inch, "DFW")
    c.setFont("Times-Roman", 60)
    c.drawString(MARGIN, PAGE_H - 3.85 * inch, "Wedding DJ")
    c.setFillColor(EMBER)
    c.setFont("Times-Italic", 60)
    c.drawString(MARGIN, PAGE_H - 4.7 * inch, "Pricing Guide.")

    # Subtitle
    c.setFillColor(CREAM)
    c.setFont("Helvetica", 13)
    c.drawString(
        MARGIN,
        PAGE_H - 5.5 * inch,
        "What it actually costs to book a great wedding DJ in",
    )
    c.drawString(MARGIN, PAGE_H - 5.8 * inch, "Dallas–Fort Worth — and how to spot a bad one before you sign.")

    # Footer block — author
    c.setFillColor(EMBER)
    c.setFont("Helvetica-Bold", 9)
    c.drawString(MARGIN, 1.6 * inch, "BY DJ DANNY WEST")
    c.setFillColor(CREAM)
    c.setFont("Helvetica", 9)
    c.drawString(MARGIN, 1.35 * inch, "Cowboys' Official Stadium Club DJ  ·  SiriusXM Mix-Show Coordinator")
    c.drawString(MARGIN, 1.15 * inch, "djdannywest.com  ·  Bookings by inquiry")

    # Tiny URL footer
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(MARGIN, 0.55 * inch, "djdannywest.com / wedding-dj-guide")
    c.restoreState()


def inner_page(c: canvas.Canvas, doc):
    """Standard inner-page chrome — running header + page number."""
    c.saveState()

    # Cream page background
    c.setFillColor(CREAM)
    c.rect(0, 0, PAGE_W, PAGE_H, stroke=0, fill=1)

    # Top hairline
    c.setStrokeColor(LINE)
    c.setLineWidth(0.5)
    c.line(MARGIN, PAGE_H - 0.55 * inch, PAGE_W - MARGIN, PAGE_H - 0.55 * inch)

    # Header text
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(MARGIN, PAGE_H - 0.42 * inch, "DJ DANNY WEST  ·  DFW WEDDING DJ PRICING GUIDE")
    c.drawRightString(PAGE_W - MARGIN, PAGE_H - 0.42 * inch, f"PAGE {doc.page - 1:02d}")

    # Bottom hairline + URL
    c.line(MARGIN, 0.7 * inch, PAGE_W - MARGIN, 0.7 * inch)
    c.setFillColor(MUTED)
    c.setFont("Helvetica", 7)
    c.drawString(MARGIN, 0.5 * inch, "djdannywest.com / book")
    c.drawRightString(PAGE_W - MARGIN, 0.5 * inch, "BOOKINGS BY INQUIRY")
    c.restoreState()


def build_styles():
    base = getSampleStyleSheet()
    styles = {}
    styles["eyebrow"] = ParagraphStyle(
        "eyebrow",
        parent=base["Normal"],
        fontName="Helvetica-Bold",
        fontSize=9,
        textColor=EMBER,
        leading=12,
        spaceAfter=6,
    )
    styles["h1"] = ParagraphStyle(
        "h1",
        parent=base["Title"],
        fontName="Times-Roman",
        fontSize=34,
        leading=38,
        textColor=INK,
        alignment=TA_LEFT,
        spaceAfter=18,
    )
    styles["h1i"] = ParagraphStyle(
        "h1i",
        parent=base["Title"],
        fontName="Times-Italic",
        fontSize=34,
        leading=38,
        textColor=EMBER,
        alignment=TA_LEFT,
        spaceAfter=18,
    )
    styles["h2"] = ParagraphStyle(
        "h2",
        parent=base["Heading2"],
        fontName="Times-Roman",
        fontSize=20,
        leading=24,
        textColor=INK,
        alignment=TA_LEFT,
        spaceBefore=14,
        spaceAfter=8,
    )
    styles["h3"] = ParagraphStyle(
        "h3",
        parent=base["Heading3"],
        fontName="Helvetica-Bold",
        fontSize=11,
        leading=14,
        textColor=INK,
        spaceBefore=10,
        spaceAfter=4,
    )
    styles["body"] = ParagraphStyle(
        "body",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=16,
        textColor=INK,
        alignment=TA_LEFT,
        spaceAfter=8,
    )
    styles["bullet"] = ParagraphStyle(
        "bullet",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=10.5,
        leading=15,
        textColor=INK,
        leftIndent=14,
        bulletIndent=2,
        spaceAfter=4,
    )
    styles["pullquote"] = ParagraphStyle(
        "pullquote",
        parent=base["Normal"],
        fontName="Times-Italic",
        fontSize=14,
        leading=20,
        textColor=INK,
        leftIndent=18,
        rightIndent=18,
        spaceBefore=10,
        spaceAfter=10,
    )
    styles["small"] = ParagraphStyle(
        "small",
        parent=base["Normal"],
        fontName="Helvetica",
        fontSize=8,
        leading=11,
        textColor=MUTED,
    )
    styles["cta"] = ParagraphStyle(
        "cta",
        parent=base["Normal"],
        fontName="Helvetica-Bold",
        fontSize=10,
        leading=14,
        textColor=CREAM,
        backColor=NIGHT,
        alignment=TA_CENTER,
        borderPadding=14,
        spaceBefore=18,
        spaceAfter=8,
    )
    return styles


def bullet(text):
    return Paragraph(f"<bullet>&bull;</bullet>&nbsp;{text}", S["bullet"])


def tier_table(title, price, fit, includes, watchouts):
    """One pricing-tier card rendered as a 2-column table."""
    rows = [
        [Paragraph(f"<b>{title}</b>", S["h3"]), Paragraph(f"<b>{price}</b>", S["h3"])],
        [
            Paragraph("<b>BEST FOR</b><br/>" + fit, S["small"]),
            Paragraph("<b>WHAT'S USUALLY INCLUDED</b><br/>" + "<br/>".join(includes), S["small"]),
        ],
        [Paragraph("<b>WATCH FOR</b><br/>" + watchouts, S["small"]), ""],
    ]
    t = Table(rows, colWidths=[3.1 * inch, 3.1 * inch])
    t.setStyle(
        TableStyle(
            [
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("BACKGROUND", (0, 0), (-1, -1), colors.white),
                ("LINEABOVE", (0, 0), (-1, 0), 1.5, EMBER),
                ("LINEBELOW", (0, -1), (-1, -1), 0.5, LINE),
                ("LEFTPADDING", (0, 0), (-1, -1), 16),
                ("RIGHTPADDING", (0, 0), (-1, -1), 16),
                ("TOPPADDING", (0, 0), (-1, -1), 14),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 14),
                ("SPAN", (0, 2), (1, 2)),
            ]
        )
    )
    return t


def venue_row(name, room_type, notes):
    return [Paragraph(f"<b>{name}</b>", S["small"]), Paragraph(room_type, S["small"]), Paragraph(notes, S["small"])]


def main():
    repo_root = Path(__file__).resolve().parent.parent
    out_dir = repo_root / "public" / "guides"
    out_dir.mkdir(parents=True, exist_ok=True)
    out_path = out_dir / "dfw-wedding-dj-guide.pdf"

    doc = BaseDocTemplate(
        str(out_path),
        pagesize=LETTER,
        leftMargin=MARGIN,
        rightMargin=MARGIN,
        topMargin=0.95 * inch,
        bottomMargin=0.95 * inch,
        title="DFW Wedding DJ Pricing & Planning Guide",
        author="DJ Danny West",
        subject="Wedding DJ pricing in Dallas–Fort Worth",
    )

    frame = Frame(
        MARGIN,
        0.85 * inch,
        PAGE_W - 2 * MARGIN,
        PAGE_H - 1.8 * inch,
        id="content",
        leftPadding=0,
        rightPadding=0,
        topPadding=0,
        bottomPadding=0,
    )
    doc.addPageTemplates(
        [
            PageTemplate(id="cover", frames=[frame], onPage=cover_page),
            PageTemplate(id="inner", frames=[frame], onPage=inner_page),
        ]
    )

    story = []

    # ====================== PAGE 1 — COVER ======================
    # The cover_page draws everything directly to the canvas.
    # Switch to the inner template BEFORE the page break so page 2 uses it.
    story.append(Spacer(1, PAGE_H - 2 * inch))
    story.append(NextPageTemplate("inner"))
    story.append(PageBreak())

    # ====================== PAGE 2 — INTRO ======================
    story.append(Paragraph("BEFORE YOU SHOP DJs", S["eyebrow"]))
    story.append(Paragraph("The honest", S["h1"]))
    story.append(Paragraph("DFW DJ market.", S["h1i"]))
    story.append(
        Paragraph(
            "If you're planning a wedding in Dallas, Fort Worth, Plano, Frisco, Arlington, "
            "Southlake, McKinney, or anywhere in between, you've probably already noticed "
            "the DJ price range is wild. Quotes from $800 to $8,000 for what looks like "
            "the same service. So which one's right? Here's the answer most planners won't "
            "give you straight.",
            S["body"],
        )
    )
    story.append(
        Paragraph(
            "I've been DJing professionally for over twenty years. I'm the official DJ for "
            "the Dallas Cowboys' Stadium Club, the SiriusXM Latin mix-show coordinator, and "
            "I've played weddings from $4,000 backyard ceremonies to seven-figure estate "
            "events at Marquee on Magnolia and the Adolphus. I'm based in Arlington — DFW "
            "is home turf.",
            S["body"],
        )
    )
    story.append(
        Paragraph(
            "&ldquo;Most couples don't overpay for a DJ. They underpay for the wrong one, "
            "then pay twice — once for the DJ, once for the rescue.&rdquo;",
            S["pullquote"],
        )
    )
    story.append(
        Paragraph(
            "This guide is what I tell every couple who calls. No upsells. No fake "
            "scarcity. Just the real numbers, the real tradeoffs, and a checklist you can "
            "take to any DJ — me or someone else — so you don't get burned.",
            S["body"],
        )
    )
    story.append(Paragraph("Inside this guide:", S["h3"]))
    for b in [
        "The four DFW wedding DJ pricing tiers — what you actually get at each",
        "Seven red flags that mean walk away (even if the price looks great)",
        "DFW venue cheat sheet — acoustics, power, and what your DJ needs to know",
        "Your 12-month music planning timeline",
        "What's worth paying extra for (and what's not)",
    ]:
        story.append(bullet(b))

    story.append(PageBreak())

    # ====================== PAGE 3 — PRICING OVERVIEW ======================
    story.append(Paragraph("PRICING — THE FOUR TIERS", S["eyebrow"]))
    story.append(Paragraph("What a DFW", S["h1"]))
    story.append(Paragraph("wedding DJ costs.", S["h1i"]))
    story.append(
        Paragraph(
            "These are real DFW market ranges as of 2026, based on direct quotes I see "
            "every week from couples who reach out after talking to other DJs. Every range "
            "is for a typical 6–8 hour wedding (ceremony + cocktail hour + reception) "
            "with ceremony sound included.",
            S["body"],
        )
    )
    story.append(
        Paragraph(
            "Mileage outside the 20-mile DFW radius, late-night extensions, second-room "
            "audio (separate ceremony space), and add-ons like uplighting, monogram "
            "projection, or photo booths are typically priced separately at every tier.",
            S["body"],
        )
    )
    story.append(Spacer(1, 8))
    story.append(
        tier_table(
            "TIER 1 — BUDGET",
            "$800 – $1,500",
            "Backyards, small intimate weddings under 75 guests, weeknights, off-peak months (Jan-Feb, Aug).",
            [
                "&bull; One DJ, 4–5 hours",
                "&bull; Basic two-speaker rig",
                "&bull; One wireless mic",
                "&bull; Spotify-style playlist",
            ],
            "Often a side-hustler — they may not show up, may not have backup gear, and the &ldquo;contract&rdquo; is sometimes a Venmo handshake. Always ask for proof of insurance.",
        )
    )
    story.append(Spacer(1, 12))
    story.append(
        tier_table(
            "TIER 2 — MID-MARKET",
            "$1,500 – $3,000",
            "Most DFW weddings, 75–175 guests, standard timeline, mainstream venues like country clubs and hotel ballrooms.",
            [
                "&bull; One DJ, 6 hours",
                "&bull; 4-speaker setup + subwoofer",
                "&bull; 2 wireless mics",
                "&bull; Custom playlist consultation",
                "&bull; MC for toasts &amp; intros",
            ],
            "Quality is wildly inconsistent in this tier. Many of these DJs are still learning. Ask to hear a recent live mix and watch how they MC on video before booking.",
        )
    )

    story.append(PageBreak())

    # ====================== PAGE 4 — TIERS 3 & 4 ======================
    story.append(Paragraph("PRICING — TIERS 3 &amp; 4", S["eyebrow"]))
    story.append(Paragraph("The upper market.", S["h1i"]))
    story.append(
        Paragraph(
            "These are the tiers where you're paying for craft, judgment, and reputation "
            "— not just gear. The hardware gap between Tier 2 and Tier 3 is small. The "
            "human gap is enormous.",
            S["body"],
        )
    )
    story.append(Spacer(1, 6))
    story.append(
        tier_table(
            "TIER 3 — PREMIUM",
            "$3,000 – $6,000",
            "150+ guest weddings, multicultural ceremonies (Latin, Indian, Persian, Vietnamese), Cowboys-tier downtown venues, anyone who wants a packed floor not a polite one.",
            [
                "&bull; Veteran DJ (10+ years)",
                "&bull; Full pro audio + lighting",
                "&bull; Multiple mic options",
                "&bull; Vibe consult &amp; do-not-play list",
                "&bull; Ceremony sound included",
                "&bull; Backup gear on-site",
                "&bull; Insured &amp; contracted",
            ],
            "This is where I sit. At $4,000–$5,500 for most DFW weddings, you're paying for someone who has played 500+ events and reads the floor before adjusting.",
        )
    )
    story.append(Spacer(1, 12))
    story.append(
        tier_table(
            "TIER 4 — LUXURY",
            "$6,000 – $12,000+",
            "Estate weddings, private clubs (Vaquero, Brook Hollow, Dallas Country Club), 300+ guests, full-production celebrity-style events.",
            [
                "&bull; Touring-level DJ",
                "&bull; Concert-grade rig",
                "&bull; Full intelligent lighting",
                "&bull; Multiple DJs / handoffs",
                "&bull; Live percussion / sax options",
                "&bull; Day-of coordinator liaison",
                "&bull; Custom intro production",
            ],
            "At this tier, hire someone with a touring or major-stage résumé — not just a wedding-DJ résumé. The skill ceiling matters when the room and the guest list do too.",
        )
    )

    story.append(PageBreak())

    # ====================== PAGE 5 — RED FLAGS ======================
    story.append(Paragraph("HOW TO SPOT A BAD DJ", S["eyebrow"]))
    story.append(Paragraph("Seven red flags.", S["h1i"]))
    story.append(
        Paragraph(
            "I get rescue calls from DFW couples almost every Saturday morning. Here's how "
            "to make sure you're never the one calling another DJ from the venue parking "
            "lot at 5pm because yours didn't show.",
            S["body"],
        )
    )
    flags = [
        (
            "01 — They can't show you a live mix from the last 60 days.",
            "Anyone can fake a website. A real DJ has fresh audio. If they can't send you "
            "a SoundCloud, Mixcloud, or video clip from a real event in the last two "
            "months, they're not currently working.",
        ),
        (
            "02 — They don't carry liability insurance.",
            "Almost every premium DFW venue requires DJs to carry $1M general liability. "
            "If they can't email you a COI in 10 minutes, they're not insured.",
        ),
        (
            "03 — &ldquo;Just send me your Spotify playlist.&rdquo;",
            "A real wedding DJ reads the floor in real time and adjusts. Playlist DJs are "
            "fine for $800 backyard parties. They're not fine for a $40,000 wedding.",
        ),
        (
            "04 — The contract is a paragraph in a text message.",
            "You should get a real contract with cancellation terms, force majeure, "
            "overtime rates, deposit structure, and gear breakdown. No contract, no booking.",
        ),
        (
            "05 — They won't tell you what gear they're bringing.",
            "A pro DJ can tell you in detail — speaker model, subwoofer model, mic model, "
            "DJ controller model. If they can't, they're either hiding a poor rig or they "
            "don't actually know.",
        ),
        (
            "06 — They &ldquo;mostly do clubs&rdquo; or &ldquo;mostly do schools.&rdquo;",
            "Wedding DJing is a separate skill. MCing toasts, navigating family politics, "
            "running a coordinated timeline with the planner — none of that happens in a "
            "club. Make sure they've done weddings recently.",
        ),
        (
            "07 — The price is suspiciously low.",
            "If a DFW DJ is quoting $500 for a 6-hour Saturday wedding, ask why. It's "
            "either a hobbyist, a no-show waiting to happen, or someone with zero "
            "credibility trying to build a portfolio on your event.",
        ),
    ]
    for title, body in flags:
        story.append(Paragraph(title, S["h3"]))
        story.append(Paragraph(body, S["body"]))

    story.append(PageBreak())

    # ====================== PAGE 6 — DFW VENUE CHEAT SHEET ======================
    story.append(Paragraph("DFW VENUE CHEAT SHEET", S["eyebrow"]))
    story.append(Paragraph("Rooms I know.", S["h1i"]))
    story.append(
        Paragraph(
            "Every venue is different — ceiling height, power, sound restrictions, where "
            "the dance floor sits. A DJ who's played the room before knows the quirks. "
            "Here are some of the DFW spots I've played, and what your DJ needs to know "
            "about each.",
            S["body"],
        )
    )
    venues = [
        venue_row("The Adolphus, Dallas", "Historic hotel ballroom", "High ceilings, marble walls — sound bounces. Subs need to be controlled or it's mud. Loadin from the alley."),
        venue_row("Four Seasons, Las Colinas", "Resort ballroom", "Power is solid, room is forgiving. Strict noise curfew at 11pm — plan your final-song moment."),
        venue_row("Marquee on Magnolia, Southlake", "Luxury wedding venue", "Beautiful room but bring your own line array for outdoor ceremony. Indoor reception sound is generous."),
        venue_row("The Filter Building, Dallas", "Industrial / loft", "Concrete + steel = serious reverb. Use directional speakers, not omnidirectional. Floor needs uplighting."),
        venue_row("Hickory Street Annex, Dallas", "Open warehouse", "Massive space, dual zones common. Plan ceremony + reception audio separately."),
        venue_row("The Brik, Fort Worth", "Industrial wedding venue", "High ceilings, exposed brick. Watch monitor placement — feedback is easy here."),
        venue_row("Stoney Ridge Villa, Azle", "Outdoor estate", "Power is limited — confirm generator needs early. No noise ordinance, but neighbors will call by 11."),
        venue_row("Hotel Crescent Court, Dallas", "Hotel ballroom", "Compact dance floor — load-out has to be quick to clear the room for breakfast."),
        venue_row("Stonebriar Country Club, Frisco", "Country club", "Standard ballroom setup. Strict end times — 11pm hard stop is real."),
        venue_row("Texas Live!, Arlington", "Entertainment district event space", "Already wired for events — your DJ can plug into house. Confirm what's included."),
    ]
    venue_table = Table(
        [["VENUE", "ROOM TYPE", "WHAT YOUR DJ NEEDS TO KNOW"]] + venues,
        colWidths=[1.7 * inch, 1.5 * inch, 3.1 * inch],
    )
    venue_table.setStyle(
        TableStyle(
            [
                ("FONT", (0, 0), (-1, 0), "Helvetica-Bold", 7.5),
                ("TEXTCOLOR", (0, 0), (-1, 0), EMBER),
                ("LINEBELOW", (0, 0), (-1, 0), 1, EMBER),
                ("LINEBELOW", (0, 1), (-1, -1), 0.25, LINE),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 4),
                ("RIGHTPADDING", (0, 0), (-1, -1), 4),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
            ]
        )
    )
    story.append(Spacer(1, 6))
    story.append(venue_table)

    story.append(PageBreak())

    # ====================== PAGE 7 — TIMELINE ======================
    story.append(Paragraph("MUSIC PLANNING TIMELINE", S["eyebrow"]))
    story.append(Paragraph("From 12 months out", S["h1"]))
    story.append(Paragraph("to last call.", S["h1i"]))
    timeline_blocks = [
        (
            "12+ months out",
            "Book your DJ. Premium DFW DJs are booked 12–18 months out for peak season "
            "(March–May, September–November). If your date is in those windows, you should "
            "already be calling.",
        ),
        (
            "9 months out",
            "First music conversation. Vibe, energy level, what you do not want. This is "
            "the lane-setting call — not a song-by-song planning session.",
        ),
        (
            "6 months out",
            "Lock the special-moment songs: processional, recessional, first dance, "
            "parent dances, cake cut. If you're doing surprise dances or a band-DJ hybrid, "
            "plan choreography now.",
        ),
        (
            "3 months out",
            "Build the do-not-play list. Be specific — &ldquo;no slow Taylor Swift&rdquo; "
            "is more useful than &ldquo;no boring music.&rdquo; Add the must-plays your "
            "family will text you about later.",
        ),
        (
            "1 month out",
            "Final timeline meeting with your DJ and planner. Sync on toast order, "
            "introductions (parents, wedding party), and the exact moment lights go up.",
        ),
        (
            "Week of",
            "Day-of contact info exchange. Your DJ should be in the planner's group chat. "
            "Confirm load-in time, dress code, and dinner-break logistics.",
        ),
        (
            "Day of",
            "Your DJ is there 90 minutes before guests arrive. Soundcheck, mic check, "
            "ceremony rehearsal music. If your DJ &ldquo;just shows up an hour before&rdquo; — "
            "that's a Tier 1 DJ, regardless of what you paid.",
        ),
    ]
    for label, body in timeline_blocks:
        story.append(Paragraph(label.upper(), S["h3"]))
        story.append(Paragraph(body, S["body"]))

    story.append(PageBreak())

    # ====================== PAGE 8 — ADD-ONS ======================
    story.append(Paragraph("ADD-ONS — WHAT'S WORTH IT", S["eyebrow"]))
    story.append(Paragraph("Worth it.", S["h1"]))
    story.append(Paragraph("Skip it.", S["h1i"]))

    story.append(Paragraph("WORTH IT", S["h3"]))
    worth = [
        "<b>Uplighting ($400–$800).</b> Changes a venue more than any other line item. If your venue is plain (a country club ballroom, a hotel banquet room), this is the single highest-ROI add-on you can buy.",
        "<b>Ceremony sound ($200–$500).</b> If your ceremony is in a separate room or outdoors, you need a second audio rig. Couples skipping this is the #1 cause of guests yelling &ldquo;louder!&rdquo; during vows.",
        "<b>Backup DJ on call ($150–$300).</b> Some premium DJs include this. A real wedding-day insurance policy if your DJ gets sick or stuck in traffic.",
        "<b>Extra hour buffer ($200–$400/hr).</b> Weddings always run long. Book the extra hour up front — it's half the price of the &ldquo;day-of overtime&rdquo; rate most DJs charge.",
    ]
    for line in worth:
        story.append(bullet(line))

    story.append(Paragraph("SKIP IT (usually)", S["h3"]))
    skip = [
        "<b>Photo booth ($800–$1,200) when bundled with a DJ.</b> The DJ-bundled photo booth is usually a basic one without an attendant. Hire a dedicated photo booth company instead, or skip — guests don't talk about it the next day.",
        "<b>Monogram projection ($300–$500).</b> Trendy in 2018, slightly dated now. If you love yours, do it. If you're on the fence, that money is better spent on uplighting.",
        "<b>Dance floor &ldquo;wow lighting&rdquo; ($1,500+ for big rigs).</b> Unless your venue is huge and dark, a competent DJ's standard lighting package is enough. Save the cash.",
        "<b>Smoke / fog effects (often $300+).</b> Fire codes vary venue to venue, and most DFW venues quietly hate this. Confirm with your planner before paying.",
    ]
    for line in skip:
        story.append(bullet(line))

    story.append(PageBreak())

    # ====================== PAGE 9 — CHECKLIST ======================
    story.append(Paragraph("THE 60-SECOND DJ INTERVIEW", S["eyebrow"]))
    story.append(Paragraph("Ten questions", S["h1"]))
    story.append(Paragraph("that filter fast.", S["h1i"]))
    story.append(
        Paragraph(
            "Read these aloud on any DJ call. If they hesitate or dodge on more than two, "
            "move on.",
            S["body"],
        )
    )
    questions = [
        "Can you send me a live mix from the last 60 days?",
        "Are you the DJ I'll be working with on the day, or a different DJ from your roster?",
        "Have you played [my venue] before? What's the gear setup that works there?",
        "Can you email me your COI (certificate of insurance)?",
        "What happens if you can't make my date — what's your backup?",
        "How do you handle do-not-play and must-play lists?",
        "How does the timeline review work with my planner?",
        "What's your overtime rate after [end time]?",
        "What's your deposit structure and cancellation policy?",
        "What's the gear you'll bring — exact speaker, sub, and mic models?",
    ]
    for i, q in enumerate(questions, 1):
        story.append(
            Paragraph(
                f"<b>{i:02d}.</b>&nbsp;&nbsp;{q}",
                ParagraphStyle(
                    f"q{i}",
                    parent=S["body"],
                    leftIndent=14,
                    spaceAfter=6,
                ),
            )
        )

    story.append(Spacer(1, 10))
    story.append(
        Paragraph(
            "&ldquo;The right DJ makes your wedding feel like the best night of the year. "
            "The wrong one makes it feel like a corporate retreat. Take the interview "
            "seriously.&rdquo;",
            S["pullquote"],
        )
    )

    story.append(PageBreak())

    # ====================== PAGE 10 — CTA ======================
    story.append(Paragraph("LET'S TALK", S["eyebrow"]))
    story.append(Paragraph("If we're a fit,", S["h1"]))
    story.append(Paragraph("send me your date.", S["h1i"]))
    story.append(
        Paragraph(
            "I take a limited number of DFW weddings each year so I can show up at the "
            "level above the average. Most of my bookings come from planner referrals, "
            "past clients, and couples who found me the way you just did.",
            S["body"],
        )
    )
    story.append(
        Paragraph(
            "Here's what happens when you send an inquiry from djdannywest.com/book:",
            S["body"],
        )
    )
    for b in [
        "I personally read every inquiry — no agency, no answering service.",
        "I respond within 24 hours with availability and an honest read on fit.",
        "If we move forward, we do a 30-minute call to lock the vibe.",
        "Then a real contract, a real deposit, and a real DJ on your date.",
    ]:
        story.append(bullet(b))

    story.append(Spacer(1, 18))
    cta_box = Table(
        [
            [Paragraph("READY TO TALK?", S["eyebrow"])],
            [Paragraph("djdannywest.com / book", ParagraphStyle("ctaurl", parent=S["h2"], fontSize=22, textColor=EMBER, leading=26, alignment=TA_CENTER))],
            [Paragraph("djdannywestbookings@gmail.com  ·  Bookings by inquiry", S["small"])],
        ],
        colWidths=[PAGE_W - 2 * MARGIN],
    )
    cta_box.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), NIGHT),
                ("ALIGN", (0, 0), (-1, -1), "CENTER"),
                ("LEFTPADDING", (0, 0), (-1, -1), 30),
                ("RIGHTPADDING", (0, 0), (-1, -1), 30),
                ("TOPPADDING", (0, 0), (-1, -1), 22),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 22),
                ("TEXTCOLOR", (0, 0), (-1, -1), CREAM),
            ]
        )
    )
    story.append(cta_box)

    story.append(Spacer(1, 14))
    story.append(
        Paragraph(
            "This guide © DJ Danny West. Share it with a friend planning a DFW wedding — "
            "but please link back to djdannywest.com/wedding-dj-guide rather than reposting "
            "the PDF directly. Thanks.",
            S["small"],
        )
    )

    doc.build(story)
    print(f"Wrote {out_path}")


S = build_styles()

if __name__ == "__main__":
    main()
