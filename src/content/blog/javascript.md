---
title: "JavaScript中的隐式转换"
description: "规则！"
image: "/images/js.jpg"
pubDate: 2025-03-19
tags: ["Js学习"]
---

# 隐式转换

**结论：对于不同类型，Js会通过一系列转换，将不同类型变成相同类型再比较，而数字就是转换的终点。**

是这样的，我们把数据类型分为对象，字符串，数字，布尔值。

而转换的顺序类似于:

![rules](/images/yingshi.png)

**什么意思？**

- 对象比较布尔：对象会先变成字符串，再变成数字；而布尔直接变成数字

```javascript
[] == true; //false  []-->''-->0 ,true-->1 , 0 == 1 false
```

- 对象比较字符串：对象变成字符串

```javascript
[1,2,3] == '1,2,3' // true  [1,2,3]-->'1,2,3'，'1,2,3'== '1,2,3' true;
```

- 对象比较数字：对象先变成字符串，再变成数字

```javascript
[1] == 1 //true [1] --> '1' --> 1, 1 == 1 true
```

按常理来说就是如此，不过有些许例外。

```javascript
[] == false;
![] == false;
```

两个结果都是true。

1.对象 -- 字符串 -- 数值0，0 == false，true。

2.要点：前面有！，要直接转化成布尔值，**空字符串，NaN，0，null，underfiend**在转换为布尔值的时候都是返回true的。所以[ ] -- true, ![ ] -- false,false == false为true。

还有需要记住的

```javascript
underfind == null // true 他俩相比就返回true，二者与其他值比较返回false
Number(null) //0
```

## 问题

为什么前面加一个 ！ 就要直接转化成布尔值了？

因为这是 ！(逻辑非运算符)的底层逻辑。他的意思就是：先将操作数强制转换为布尔值，再取反，这是js语言规范定义的强制转换行为。
