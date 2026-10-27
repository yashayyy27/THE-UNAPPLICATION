"""Generate the default decision brief. Dynamic selections download separately as HTML."""
from pathlib import Path
from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.pagesizes import A4
from reportlab.platypus import Paragraph
from reportlab.lib.styles import ParagraphStyle
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'public/decision-brief.pdf'
INK=HexColor('#172013'); MUTED=HexColor('#54604c'); LINE=HexColor('#c4cbbb')
c=canvas.Canvas(str(OUT),pagesize=A4)
c.setTitle('THE UNAPPLICATION - Decision brief');c.setAuthor('Yash Hurdale');c.setSubject('Independent R/GA edition. Synthetic analysis; review draft.')
w,h=A4;x=43;y=h-42;cw=w-86
c.setFillColor(INK);c.rect(x,y-5,cw,7,fill=1,stroke=0)
y-=31;c.setFont('Helvetica-Bold',10);c.drawString(x,y,'THE UNAPPLICATION');c.setFont('Helvetica',9);c.drawRightString(w-x,y,'YASH HURDALE / R/GA - 001')
y-=49;c.setFont('Helvetica-Bold',34);c.drawString(x,y,'Attention is up.');y-=36;c.drawString(x,y,'What decision follows?')
y-=29;c.setFillColor(HexColor('#deefb8'));c.rect(x,y-6,cw,21,fill=1,stroke=0);c.setFillColor(INK);c.setFont('Helvetica-Bold',8);c.drawString(x+9,y+1,'SYNTHETIC SCENARIO  /  NOT CLIENT DATA  /  REVIEW DRAFT')
y-=31
style=ParagraphStyle('body',fontName='Helvetica',fontSize=9.2,leading=13,textColor=INK)
def block(label,text):
 global y
 c.setStrokeColor(LINE);c.setLineWidth(.5);c.line(x,y+7,w-x,y+7)
 c.setFillColor(MUTED);c.setFont('Helvetica-Bold',8);c.drawString(x,y-7,label)
 p=Paragraph(text,style);pw,ph=p.wrap(cw,200);p.drawOn(c,x,y-18-ph);y-=ph+41
block('01 / BUSINESS QUESTION','A fictional commerce campaign gains attention without gaining purchases. What should an analyst investigate before recommending a change? Two illustrative, equal 14-day periods; USD throughout.')
block('02 / OBSERVED FIXTURE','Engaged sessions: <b>2,000 to 3,300 (+65%)</b>. Sessions: 5,000 to 7,500. Purchases: <b>100 to 100</b>. Revenue: <b>$8,000 to $8,000</b>. Observed session conversion: 2.00% to 1.33%. These are invented counts, not client results.')
block('03 / MEASUREMENT INTEGRITY','120 raw purchase firings include 20 duplicates, leaving 100 unique orders. Deduplication fixes a counting discrepancy; it does not explain flat revenue. If tracking is broken, pause conversion and channel conclusions.')
block('04 / RECOMMENDED ACTION','<b>Reconcile measurement before changing spend.</b> Compare transaction IDs, values, currency and refunds with the order ledger. Inspect consent-aware delivery and missing campaign labels. Rebaseline after the checks, then preregister a controlled test with purchase and revenue guardrails.')
block('05 / ASSUMPTIONS AND BUSINESS RELEVANCE','Default missingness assumption: 0%; 100 modelled purchases, not recovered sales. At an assumed $1,000 delivery cost and $40 contribution per incremental order, break-even needs <b>25 incremental orders</b>. This is a hurdle, not a forecast. The aim is to reduce the risk of funding the wrong fix; no uplift or causality is established.')
block('06 / ENGINEERING EVIDENCE','Exclamation AI is the separate technical source: ordered SQL/Python analysis, documented Google reconciliation and measurement receipts. Historical Google work is separate from this synthetic challenge. Live model quality and BigQuery SDK transport remain unverified.<br/><link href="https://github.com/yashayyy27/exclamation-ai/blob/35f1aff81c166215496b0f0b2b041db7a4c0360e/docs/verification.md" color="#172013"><u>Inspect verification and limitations at the audited source revision.</u></link>')
assert y>65, f'Content exceeds one-page layout: {y}'
c.setStrokeColor(LINE);c.line(x,58,w-x,58);c.setFillColor(MUTED);c.setFont('Helvetica',7.2)
c.drawString(x,44,'Independent candidate project. Not affiliated with or endorsed by R/GA.')
c.drawString(x,33,'yash.h2700@gmail.com  |  github.com/yashayyy27  |  Default lens: measurement / challenge: tracking')
c.drawRightString(w-x,22,'01 / 01');c.save()
print(OUT)
