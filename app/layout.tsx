import type { Metadata } from "next";
import "./globals.css";
import "./artwork.css";
export const metadata: Metadata = {
  title: "THE UNAPPLICATION — Yash Hurdale · R/GA 001",
  description:
    "Don’t interview my resume. Interview my thinking. An independent, interactive application by Yash Hurdale, grounded in inspectable analytical evidence.",
  robots: { index: false, follow: false },
  icons: { icon: "./favicon.svg" },
};
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <head>
        {/* Keep first paint independent of offscreen styling; no React dependency. */}
        <script dangerouslySetInnerHTML={{ __html: `document.addEventListener("load",function(e){
  var link=e.target;if(link.id!=="scene-styles")return;
  var apply=function(){link.media="all"};
  if(performance.getEntriesByName("first-contentful-paint").length){apply();return}
  if(typeof PerformanceObserver==="function"&&PerformanceObserver.supportedEntryTypes?.includes("paint")){
    var observer=new PerformanceObserver(function(list){
      if(list.getEntries().some(function(entry){return entry.name==="first-contentful-paint"})){
        observer.disconnect();apply();
      }
    });observer.observe({type:"paint",buffered:true});
  }else requestAnimationFrame(function(){requestAnimationFrame(apply)});
},true)` }} />
        <link id="scene-styles" rel="stylesheet" href="./scenes.css" media="print" suppressHydrationWarning />
        <noscript><link rel="stylesheet" href="./scenes.css" /></noscript>
      </head>
      <body>{children}</body>
    </html>
  );
}
