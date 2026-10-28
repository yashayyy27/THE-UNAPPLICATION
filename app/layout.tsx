import type { Metadata } from "next";
import "./globals.css";
import "./artwork.css";
const title = "THE UNAPPLICATION — Yash Hurdale · R/GA 001";
const description = "Independent Data Analyst application by Yash Hurdale. Inspect SQL, Python, BigQuery and GA4/GTM evidence, challenge the analysis and arrange an interview.";
const siteURL = "https://yashayyy27.github.io/THE-UNAPPLICATION/";
export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: siteURL },
  openGraph: { title, description, url: siteURL, type: "website", locale: "en_AU" },
  twitter: { card: "summary", title, description },
  robots: {
    index: process.env.NEXT_PUBLIC_SITE_RELEASE === "true",
    follow: process.env.NEXT_PUBLIC_SITE_RELEASE === "true",
  },
  icons: { icon: `${process.env.NEXT_PUBLIC_BASE_PATH || ""}/favicon.svg` },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Keep first paint independent of offscreen styling; no React dependency. */}
        <script dangerouslySetInnerHTML={{ __html: `(function(){
var initialHash=location.hash,initialNavigation=!!initialHash;
if(initialNavigation){
  var cancel=function(){initialNavigation=false};
  ["pointerdown","keydown","touchstart","wheel","hashchange"].forEach(function(type){addEventListener(type,cancel,{once:true,passive:true})});
}
document.addEventListener("load",function(e){
  var link=e.target;if(link.id!=="scene-styles")return;
  var apply=function(){
    link.media="all";
    if(!initialNavigation||location.hash!==initialHash)return;
    var align=function(){requestAnimationFrame(function(){
      if(!initialNavigation||location.hash!==initialHash)return;
      var id;try{id=decodeURIComponent(initialHash.slice(1))}catch(e){return}
      document.getElementById(id)?.scrollIntoView({block:"start",behavior:"instant"});
      initialNavigation=false;
    })};
    if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",align,{once:true});else align();
  };
  if(performance.getEntriesByName("first-contentful-paint").length){apply();return}
  if(typeof PerformanceObserver==="function"&&PerformanceObserver.supportedEntryTypes?.includes("paint")){
    var observer=new PerformanceObserver(function(list){
      if(list.getEntries().some(function(entry){return entry.name==="first-contentful-paint"})){
        observer.disconnect();apply();
      }
    });observer.observe({type:"paint",buffered:true});
  }else requestAnimationFrame(function(){requestAnimationFrame(apply)});
},true);})();` }} />
        <link id="scene-styles" rel="stylesheet" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/scenes.css`} media="print" suppressHydrationWarning />
        <noscript><link rel="stylesheet" href={`${process.env.NEXT_PUBLIC_BASE_PATH || ""}/scenes.css`} /></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
