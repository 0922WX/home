---
title: "Go 语言学习"
description: "毕设的挣扎"
image: "/images/kitchen.jpg"
pubDate: 2025-03-18
tags: ["Go学习"]
---

## 《Go语言+Vue.js实战派-基于Gin框架》
用于速成我想用Gin做管理系统。

遇到报错

> SECURITY ERROR
> This download does NOT match the one reported by the checksum server.
> The bits may have been replaced on the origin server, or an attacker may
> have intercepted the download attempt.
>
> For more information, see 'go help module-auth'.
> go: github.com/go-sql-driver/mysql@v1.9.1: verifying module: checksum mismatch
>         downloaded: h1:oDr3crteKcueQ18yeWSyj52l3Qp8kh4zQlbbJFq0hLY=
>         sum.golang.org: h1:FrjNGn/BsJQjVRuSa8CBrM5BWA9BWoXXat3KrtSb/iI=
>
> SECURITY ERROR
> This download does NOT match the one reported by the checksum server.
> The bits may have been replaced on the origin server, or an attacker may
> have intercepted the download attempt.

原因：下载内容与包管理内代码源不一致

解决：删除`Go.sum`，随后`go clean -modcache`，最后`go mod tidy`解决