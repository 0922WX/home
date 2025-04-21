---
title: "简单学下mbox"
description: "状态管理"
image: "/images/js.jpg"
pubDate: 2025-04-21
tags: ["前端学习"]
---

```jsx
import {makeAutoObservable} from "mobx"
class User {
  //状态
  name='wx'
  
  //动作
  construct(){
    makeAutoObservable(this)
  }
  changeNmae(newName){
    this.name = newName
  }
}


const user = new User()
```



类的写法，makeAutoObservable(this)的作用是把这个对象(this)转变成**可观察的对象**。

谁去观察？组件。

创造一个有观察能力的组件。用observer包裹观察。

```jsx
import {observer} from "mobx-react-lite"
const MyComponent = observer( ( ) => {
    
})


function App() {
  return (
  <>
    <MyCompoent store={user} />
  </>
  )
} 
```

组件通过props接收

```jsx
import {observer} from "mobx-react-lite"
const MyComponent = observer(({store}) => {
    return (
      <h2>姓名:{store.name}</h2>
      <button>修改名字</button>
  )
})




function App() {
  return (
  <>
    <MyCompoent store={user} />
  </>
  )
}
```

随意解构成员会报错，也就是this丢失

```jsx
const MyComponent = observer(({store}) => {
    const {name} = store
    return (
      <h2>姓名:{store.name}</h2>
      <button>修改名字</button>
  )
})
```

解决方法

```jsx
makeAutoObservable(this,{},{autoBind:true})
```