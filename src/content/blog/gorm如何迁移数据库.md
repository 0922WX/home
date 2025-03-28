---
title: "Gorm迁移数据库"
description: "从无到有"
image: "/images/kongque.jpg"
pubDate: 2025-03-26
tags: ["Go学习"]
---



# 过程

我连接的过程。

我的数据库模型文件在server/model下，这是我的user.go

```go
package models

import (
    "time"
)

// 用户模型
type User struct {
    ID        uint      `gorm:"primaryKey;autoIncrement"`
    Username  string    `gorm:"size:50;not null;unique"`
    Password  string    `gorm:"size:100;not null"`
    RealName  string    `gorm:"size:50;not null"`
    Email     string    `gorm:"size:100"`
    Phone     string    `gorm:"size:20"`
    Status    int8      `gorm:"default:1;comment:'0-禁用,1-启用'"`
    CreatedAt time.Time
    UpdatedAt time.Time
    
    // 关联
    Roles     []Role    `gorm:"many2many:user_roles"`
    TeacherInfo *TeacherInfo `gorm:"foreignKey:UserID"`
}

// 角色模型
type Role struct {
    ID          uint      `gorm:"primaryKey;autoIncrement"`
    RoleName    string    `gorm:"size:50;not null;unique"`
    Description string    `gorm:"size:200"`
    CreatedAt   time.Time
    UpdatedAt   time.Time
    
    // 关联
    Permissions []Permission `gorm:"many2many:role_permissions"`
    Users       []User       `gorm:"many2many:user_roles"`
}

// 权限模型
type Permission struct {
    ID               uint   `gorm:"primaryKey;autoIncrement"`
    PermissionName   string `gorm:"size:50;not null;unique"`
    PermissionKey    string `gorm:"size:100;not null;unique;comment:'权限标识符'"`
    Description      string `gorm:"size:200"`
    CreatedAt        time.Time
    
    // 关联
    Roles []Role `gorm:"many2many:role_permissions"`
}

// 用户角色关联表
type UserRole struct {
    ID     uint `gorm:"primaryKey;autoIncrement"`
    UserID uint `gorm:"not null;index"`
    RoleID uint `gorm:"not null;index"`
}

// 角色权限关联表
type RolePermission struct {
    ID           uint `gorm:"primaryKey;autoIncrement"`
    RoleID       uint `gorm:"not null;index"`
    PermissionID uint `gorm:"not null;index"`
}

// 教师信息模型
type TeacherInfo struct {
    ID         uint   `gorm:"primaryKey;autoIncrement"`
    UserID     uint   `gorm:"not null;unique"`
    TeacherCode string `gorm:"size:20;not null;unique;comment:'教师工号'"`
    Department string `gorm:"size:50;comment:'所属院系'"`
    Position   string `gorm:"size:50;comment:'职称'"`
    EntryDate  *time.Time `gorm:"comment:'入职日期'"`
    Education  string `gorm:"size:50;comment:'学历'"`
    Degree     string `gorm:"size:50;comment:'学位'"`
  
    // 关联
    User       User   `gorm:"foreignKey:UserID"`
}
```

启动数据库的文件为server/config/database.go

```go
package config

import (
    "fmt"
    "gorm.io/driver/mysql"
    "gorm.io/gorm"
    "gorm.io/gorm/logger"
    "manager-server/model"
)

var DB *gorm.DB

// 初始化数据库连接 (包含连接池配置)
func InitDB() error {
    // 从环境变量或配置文件读取
    dbConfig := Cfg.Database
    dsn := fmt.Sprintf("%s:%s@tcp(%s:%d)/%s?charset=utf8mb4&parseTime=True&loc=Local",
        dbConfig.User,
        dbConfig.Password,
        dbConfig.Host,
        dbConfig.Port,
        dbConfig.DBName,
    )

    var err error
    DB, err = gorm.Open(mysql.Open(dsn), &gorm.Config{
        Logger: logger.Default.LogMode(logger.Info), 
    })
    
    if err != nil {
        return fmt.Errorf("数据库连接失败: %v", err)
    }

    // 配置连接池
    sqlDB, _ := DB.DB()
    sqlDB.SetMaxIdleConns(10)       // 空闲连接数
    sqlDB.SetMaxOpenConns(100)      // 最大打开连接数
    DB.AutoMigrate(
        &models.User{},
        ) // 自动迁移模型
    return nil
}
```