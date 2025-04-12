---
title: "Vue面试题"
description: "没啥用"
image: "/images/wall.jpg"
pubDate: 2025-04-02
tags: ["Vue学习"]
---

# Vue2和Vue3的区别

1. 响应式系统：
   - Vue2使用`Object.defineProperty`实现响应式系统，缺点是无法检测属性的添加和删除，以及无法处理数组索引和长度的变化。
   - Vue3采用`Proxy`实现响应式，能弥补Vue2的劣势。
2. 组合式API：
   - Vue2使用选项式API`data,methods,computed`。
   - Vue3引入组合式API,`ref,reactive,computed,watch`。
3. Fragment：
   - Vue2要求每个组件必须有一个单独的根节点。
   - Vue3允许多个根节点。
4. 响应式系统：
   - Vue2使用`Object.defineProperty`实现响应式系统，缺点是无法检测属性的添加和删除，以及无法处理数组索引和长度的变化。
   - Vue3采用`Proxy`实现响应式，能弥补Vue2的劣势。
5. 静态元素提升：
   - Vue2中，模板中所有元素在每次重新渲染时都会被创建新的虚拟节点，包括静态元素。
   - Vue3引入静态元素提升概念。编译模板时，Vue3会检测出静态内容将其提升，这些内容只在初次渲染时创建一次。后续渲染中会重用静态内容，减少渲染开销和提升性能。。
6. 生命周期变化：
   - Vue2使用一系列生命周期钩子`created,mounted,updated,destroyed`。
   - Vue3重命名和调整了这些生命周期钩子，比如把`beforeDestory`和`destoryed`改名为`beforeUnmount`和`unmounted`。
7. 响应式系统：
   - Vue2使用`Object.defineProperty`实现响应式系统，缺点是无法检测属性的添加和删除，以及无法处理数组索引和长度的变化。
   - Vue3采用`Proxy`实现响应式，能弥补Vue2的劣势。
8. 虚拟节点静态标记：
   - Vue2在更新组件时会进行全面的虚拟DOM比较，这可能会导致性能开销。
   - Vue3引入Patch Flag优化技术，即标记虚拟节点的动态部分，在组件更新时，Vue只需要关注这些被标记的部分而不是整个组件树。

