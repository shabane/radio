# [radio](https://js-radio.github.io/)

![Static Badge](https://img.shields.io/badge/github-gh?style=for-the-badge&logo=github&logoColor=%23fff&color=%23505050)
![Static Badge](https://img.shields.io/badge/github_pages-gh?style=for-the-badge&logo=githubpages&logoColor=%23fff&color=%23505050)
![Static Badge](https://img.shields.io/badge/vueJs-js?style=for-the-badge&logo=vuedotjs&logoColor=%234FC08D&color=%23505050)
![Static Badge](https://img.shields.io/badge/Js-Js?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E&color=%23505050)
![Static Badge](https://img.shields.io/badge/axios-axios?style=for-the-badge&logo=axios&logoColor=%235A29E4&color=%23707070)


Simple serverless no-bullshit **Radio** web-app
written with pure Vuejs. focusing on **listening**
without _distracting on what music to listen!_


### The Idea

well, when I start to coding, I need a music which make me focus
on the code, before this site I just used telegram for my musics and the
messages I got or its notifications and the ability to change and
selecting the music make me distract again!

so decided to create a website for listening to musics
without any distractions, just open to listen ;)

> the **only two** ability users have are that they can
> _change between_ stations and _increase/decrease_ volume.



### How It Works?

all musics come from **github**! and the web-ui
it self serve from **github pages**. everything are
on the github.

> technically we have one directory per each music genre 
> like the [rock](https://github.com/bit-orbit/rock) repo which
> all the rock musics come from.
> the [radio](https://github.com/shabane/radio) it self
> have a specific directory called `station`, where
> stations listed there as git submodule.
> the web-ui will request an API call to list all the
> stations and then it will request for listing station musics
> and after all, it will play one randomly.


### How To Add Station?

to adding a new station for example `jazz` you must
create a github repo with this structure:

```txt
jazz
└── files
    ├── bg
    └── musics
```

- all musics goes to `jazz/files/musics`
  - music files should be in .opus format(thie make them smaller file size)
- each station should have a background image in `jazz/files/bg`
  - background image name should be **bg**. for example: **bg.[gif]**
  - the format extension can be one of: _[gif, png, jpg, webp]_

then just open an issue and tell me your station repo url.
> the repo should be on github


### Donation :)

if you find this stuff useful, then I will
be happy for receive any [donation](https://daramet.com/shabane)
