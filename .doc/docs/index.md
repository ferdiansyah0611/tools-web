---
layout: home
title: Home
footer: true
hero:
  name: Tools Web
  text: Speed up developing a website using the cli.
  tagline: Not only to speed things up but also to meet the deadline for a website project because you don't have to type from scratch again.
  actions:
    - 
      theme: brand
      text: Get Started
      link: /guide/getting-started
    - 
      theme: alt
      text: View on GitHub
      link: https://github.com/ferdiansyah0611/tools-web

features:
  - 
    icon: 🤑
    title: Simple Install
    details: Just write one line and you got the project
  - 
    icon: 🛠️
    title: Integration
    details: Simple integration with Zero Configuration
  - 
    icon: 👨‍💻
    title: Generator
    details: Generate any code like component, routing, and more
  - 
    icon: ⏳
    title: Save Time
    details: Save your time upto 10% to make project
---

<script setup>
import {
  VPTeamPage,
  VPTeamPageTitle,
  VPTeamMembers
} from 'vitepress/theme'

const members = [
  {
    avatar: 'https://firebasestorage.googleapis.com/v0/b/ferdiansyah.appspot.com/o/IMG_20230903_201320.JPG?alt=media&token=864f5945-cfc3-4843-9bff-e2aab1f78296',
    name: 'Ferdiansyah',
    title: 'Creator',
    links: [
      { icon: 'github', link: 'https://github.com/ferdiansyah0611' },
      { icon: 'twitter', link: 'https://twitter.com/ferdiansyah0611' },
      { icon: { svg: svgTiktok() }, link: 'https://www.tiktok.com/@ferdy.shelby' }
    ]
  },
]

function svgTiktok() {
	return `<svg fill="#000000" viewBox="0 0 512 512" id="icons" xmlns="http://www.w3.org/2000/svg"><g id="SVGRepo_bgCarrier" stroke-width="0"></g><g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g><g id="SVGRepo_iconCarrier"><path d="M412.19,118.66a109.27,109.27,0,0,1-9.45-5.5,132.87,132.87,0,0,1-24.27-20.62c-18.1-20.71-24.86-41.72-27.35-56.43h.1C349.14,23.9,350,16,350.13,16H267.69V334.78c0,4.28,0,8.51-.18,12.69,0,.52-.05,1-.08,1.56,0,.23,0,.47-.05.71,0,.06,0,.12,0,.18a70,70,0,0,1-35.22,55.56,68.8,68.8,0,0,1-34.11,9c-38.41,0-69.54-31.32-69.54-70s31.13-70,69.54-70a68.9,68.9,0,0,1,21.41,3.39l.1-83.94a153.14,153.14,0,0,0-118,34.52,161.79,161.79,0,0,0-35.3,43.53c-3.48,6-16.61,30.11-18.2,69.24-1,22.21,5.67,45.22,8.85,54.73v.2c2,5.6,9.75,24.71,22.38,40.82A167.53,167.53,0,0,0,115,470.66v-.2l.2.2C155.11,497.78,199.36,496,199.36,496c7.66-.31,33.32,0,62.46-13.81,32.32-15.31,50.72-38.12,50.72-38.12a158.46,158.46,0,0,0,27.64-45.93c7.46-19.61,9.95-43.13,9.95-52.53V176.49c1,.6,14.32,9.41,14.32,9.41s19.19,12.3,49.13,20.31c21.48,5.7,50.42,6.9,50.42,6.9V131.27C453.86,132.37,433.27,129.17,412.19,118.66Z"></path></g></svg>`
}
</script>

<VPTeamPage size="medium">
  <VPTeamPageTitle>
    <template #title>
      Our Team
    </template>
    <template #lead>
      The development of Tools Web is guided by an international
      team, some of whom have chosen to be featured below.
    </template>
  </VPTeamPageTitle>
  <VPTeamMembers
    :members="members"
  />
</VPTeamPage>

