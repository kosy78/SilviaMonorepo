---
title: Dezactivarea Cloudflare Web Analytics în V1
date: 2026-07-09
status: approved
area: website
updates:
  - 2026-07-05-google-analytics-v1
tags:
  - decizie
  - website
  - analytics
  - confidentialitate
---

# Dezactivarea Cloudflare Web Analytics în V1

## Context

Proiectul Cloudflare Pages avea Web Analytics activ la nivel de hosting, în
paralel cu integrarea Google Analytics condiționată de consimțământ. Cele două
fluxuri făceau comportamentul public și notice-ul mai greu de înțeles și de
verificat.

## Decizie

- Cloudflare Web Analytics este dezactivat din configurația proiectului Pages.
- Google Analytics rămâne singurul analytics V1 și se încarcă numai după
  acceptarea explicită din panoul website-ului.
- Cloudflare rămâne furnizorul de hosting și securitate și poate prelucra date
  tehnice necesare livrării requesturilor; această decizie privește numai
  produsul Web Analytics injectat în pagini.
- Reactivarea Cloudflare Web Analytics necesită o decizie nouă, actualizarea
  documentației și re-revizuirea notice-ului public.

## Verificare

Configurația Cloudflare Pages a fost actualizată la 2026-07-09 astfel încât
`web_analytics_tag` și `web_analytics_token` să nu mai fie active. Verificarea
finală trebuie repetată pe deploymentul protejat.

## Consecințe

Implementarea și copy-ul V1 pot descrie un singur mecanism analytics opțional,
iar testele trebuie să confirme că `gtag.js` nu este cerut înainte de
consimțământ.
