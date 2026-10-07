---
title: "Building an offline player for Aneko Press: from YouTube in bed to an architecture built to last"
description: "How a broken official app, an unexpected Pixel gift, and bedtime audio cravings turned into an offline-first mobile app built to outlast its source."
date: 2026-10-06
tags:
  - mobile
  - audio
  - reflection
draft: true
cover:
  src: ../../assets/images/writing/building-aneko-press-cover.png
  alt: An abstract mid-century Memphis design illustration of an angled smartphone with acoustic wave ripples, floating classic books, and geometric data cubes on a warm cream surface.
locale: en
---

I discovered Aneko Press[^1] on YouTube[^2] completely by accident whilst searching for Christian books.

At first, I listened to a few recordings in the background while working during the day. That worked well enough. The trouble began when I wanted to listen before bed and in bed.

Leaving YouTube running on a phone in a dark bedroom is a miserable experience. The screen stays lit and glares across the room, and the moment the display sleeps, the playback cuts out unless you pay for a subscription.

I noticed Aneko Press had an official mobile app. I installed it hoping for a proper player, but the app was *terrible*. It streamed tracks straight off SoundCloud. Sometimes it worked; sometimes it simply gave up mid-sentence. It was so unreliable that they eventually pulled it off the Google Play Store altogether.

I was already an Audible fan, but paying monthly subscription credits for public domain books that Aneko was offering for free on YouTube was a non-starter for me. Years passed. The craving for those recordings never went away, but I still had no decent way to listen to them.

## An unexpected gift

Around that time, I purchased a Google Pixel phone.[^3] As part of the purchase, Google offered a free one-year subscription to Gemini Advanced.

It was an unexpected gift, and initially I had no idea what to do with it. Then the thought struck me: <mark>I could use this free gift to give a gift back to the world</mark>.

I opened Excalidraw,[^4] sketched out the interface I had wanted for years, and handed the drawings to Gemini to start scaffolding the app.

The first version was bad. I threw it out and started again. When I began, I thought the whole thing would take a couple of weeks. Instead, it took months, punctuated by long pauses when life took over. What began as a primitive play and pause button steadily grew, screen by screen and commit by commit, into a complete application.

## Building for the senses

When you build software for yourself, you do not care about bloated feature roadmaps. You care about the sensory details that make you want to open the app every day.

Three things mattered most to me:

First, daily habits. I added listening streaks and trophies because keeping a steady rhythm with classic literature takes intentionality. Seeing the streak hold gave the reading a quiet momentum.

Second, the bedtime soundscape. Listening to a dry, spoken narrator in a silent room can feel stark. I wanted gentle ambient audio (soft piano, quiet rain, or warm strings) layered underneath the narrator's voice so the bedroom felt calm. Getting both streams to play in harmony, letting the ambient sound sit quietly in the background without overpowering the narrator or claiming the lock screen, turned out to be one of my favourite parts of the entire player.

Third, travel. I listen in the car just as often as I listen before sleep. I wired the player directly into Apple CarPlay and Android Auto so that stepping into the vehicle transfers the chapter straight to the dashboard without fumbling with phone menus or Bluetooth toggles.

## Cutting the cord

The earliest version of the app was just a mobile frontend with a local database to save chapters for offline listening. But relying directly on SoundCloud soon hit a wall.

The public RSS feeds were capped at five hundred tracks, which meant older books simply vanished. The descriptions were inconsistent, track orders were scrambled, and almost every author tag was generic.

I realised that if I wanted a library that would genuinely last, the app could not depend on the whims of an external streaming site. I brought in Cloudflare Workers to act as an edge middleware, aggregating the catalogue beyond SoundCloud's track limits. When feed descriptions were scrambled, I used vision OCR to read the book covers and reconstruct the missing author credits.

The result is that the mobile app no longer even knows SoundCloud exists. It speaks only to Cloudflare. Even if the original source disappears tomorrow, every book, chapter, and cover in the app will keep playing.

## Looking ahead

What began as personal frustration with a glowing phone screen in bed grew into something much bigger.

As the player took shape, I started researching Aneko Press more deeply: who they were, what they published, and who was actually listening. I discovered that their audiobooks reach far beyond casual bedtime listeners, serving people with intermittent connectivity, developing regions, and prison ministries. That research fundamentally shifted the project. It shaped the architecture document and transformed a private tool into a resilient, offline-first platform designed to survive anywhere.

After building the core app, I reached out to the people at Aneko Press to show them what I had made. That conversation is a story for another day; for now, I still need to get the app published to the world.

A gift received, and a gift passed along.

> "As each has received a gift, use it to serve one another, as good stewards of God's varied grace." (1 Peter 4:10, ESV)

## Notes

[^1]: Aneko Press publishes classic Christian literature and audiobooks: [anekopress.com](https://anekopress.com).
[^2]: Aneko Press channel on YouTube: [youtube.com/@Anekopress/videos](https://www.youtube.com/@Anekopress/videos).
[^3]: Google Pixel phone series: [store.google.com/category/phones](https://store.google.com/category/phones).
[^4]: Excalidraw virtual whiteboard: [excalidraw.com](https://excalidraw.com).
