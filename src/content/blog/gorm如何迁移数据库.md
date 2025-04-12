---
title: "Gorm迁移数据库"
description: "从无到有"
image: "/images/golang.png"
pubDate: 2025-03-26
tags: ["Go学习"]
---



# 过程

我连接的过程。

我的数据库模型文件在server/model下，这是我的user.go

```go
package models

import (
	"gorm.io/gorm"
	"time"
)

// 用户基础模型
type User struct {
	gorm.Model
	Username     string `gorm:"uniqueIndex;size:50;not null"`
	Password     string `gorm:"size:255;not null"`
	RealName     string `gorm:"size:50"`
	Email        string `gorm:"size:100"`
	Phone        string `gorm:"size:20"`
	LastLogin    time.Time
	Status       int       `gorm:"default:1;check:status IN (0,1)"` // 0-禁用 1-正常
	RoleID       uint      `gorm:"not null"`
	Role         Role      `gorm:"foreignKey:RoleID"`
	DepartmentID *uint
	Department   Department `gorm:"foreignKey:DepartmentID"`
}

// 角色表
type Role struct {
	gorm.Model
	Name        string `gorm:"uniqueIndex;size:50;not null"`
	Description string `gorm:"size:255"`
	Permissions []Permission `gorm:"many2many:role_permissions;"`
}

// 权限表
type Permission struct {
	gorm.Model
	Name        string `gorm:"uniqueIndex;size:50;not null"`
	Description string `gorm:"size:255"`
	Code        string `gorm:"uniqueIndex;size:50;not null"`
}

// 教师信息表（扩展用户表）
type Teacher struct {
	gorm.Model
	UserID          uint   `gorm:"uniqueIndex;not null"` // 必须关联用户
	User            User   `gorm:"foreignKey:UserID"`
	TeacherNumber   string `gorm:"uniqueIndex;size:20;not null"`
	Title           string `gorm:"size:50"`
	Introduction    string `gorm:"type:text"`
	DegreeLevel     string `gorm:"size:50"`
	EmploymentDate  time.Time
	SpecializedArea string `gorm:"size:100"`
}

// 院系表
type Department struct {
	gorm.Model
	Name        string `gorm:"uniqueIndex;size:100;not null"`
	Code        string `gorm:"uniqueIndex;size:50;not null"`
	Description string `gorm:"size:255"`
	ParentID    *uint
	Parent      *Department `gorm:"foreignKey:ParentID"`
}

// 专业表
type Major struct {
	gorm.Model
	Name         string `gorm:"uniqueIndex;size:100;not null"`
	Code         string `gorm:"uniqueIndex;size:50;not null"`
	Description  string `gorm:"size:255"`
	DepartmentID uint   `gorm:"not null"` // 必须属于院系
	Department   Department `gorm:"foreignKey:DepartmentID"`
}

// 教室表（使用联合唯一索引）
type Classroom struct {
	gorm.Model
	Building   string `gorm:"uniqueIndex:classroom_loc;size:50;not null"`
	Floor      int    `gorm:"uniqueIndex:classroom_loc;not null"`
	RoomNumber string `gorm:"uniqueIndex:classroom_loc;size:20;not null"`
	Capacity     int
	IsMultimedia bool `gorm:"default:false"`
}

// 学期表
type Semester struct {
	gorm.Model
	Name      string `gorm:"uniqueIndex;size:50;not null"`
	StartDate time.Time
	EndDate   time.Time
	IsActive  bool `gorm:"index;default:false"`
}

// 课程表
type Course struct {
	gorm.Model
	Name        string `gorm:"size:100;not null"`
	Code        string `gorm:"uniqueIndex;size:50;not null"`
	Credits     float32
	Hours       int
	Description string `gorm:"size:255"`
	MajorID     uint   `gorm:"not null"`
	Major       Major `gorm:"foreignKey:MajorID"`
}

// 课程排班表（优化时间字段）
type CourseSchedule struct {
	gorm.Model
	SemesterID   uint      `gorm:"index"`
	Semester     Semester  `gorm:"foreignKey:SemesterID"`
	CourseID     uint      `gorm:"index"`
	Course       Course    `gorm:"foreignKey:CourseID"`
	TeacherID    uint      `gorm:"index"`
	Teacher      Teacher   `gorm:"foreignKey:TeacherID"`
	ClassroomID  uint
	Classroom    Classroom `gorm:"foreignKey:ClassroomID"`
	DayOfWeek    int       `gorm:"not null;check:day_of_week BETWEEN 1 AND 7"`
	StartTime    string    `gorm:"size:5;not null"`  // 格式："09:00"
	EndTime      string    `gorm:"size:5;not null"`  // 格式："11:00"
	StartWeek    int       `gorm:"not null;check:start_week >= 1"`
	EndWeek      int       `gorm:"not null;check:end_week >= start_week"`
	WeekType     int       `gorm:"default:0;check:week_type IN (0,1,2)"` // 0-不限 1-单周 2-双周
	StudentClass string    `gorm:"size:100"`
}

// 调课申请表（优化外键）
type CourseAdjustment struct {
	gorm.Model
	ScheduleID      uint           `gorm:"index"`
	Schedule        CourseSchedule `gorm:"foreignKey:ScheduleID"`
	TeacherID       uint           `gorm:"index"`
	Teacher         Teacher        `gorm:"foreignKey:TeacherID"`
	OriginalDate    time.Time      `gorm:"type:date;not null"`
	AdjustedDate    time.Time      `gorm:"type:date;not null"`
	OriginalRoom    *uint
	OriginalClassroom Classroom `gorm:"foreignKey:OriginalRoom"`
	NewRoom         *uint
	NewClassroom    Classroom `gorm:"foreignKey:NewRoom"`
	Reason          string    `gorm:"size:255;not null"`
	Status          int       `gorm:"default:0;check:status IN (0,1,2)"`
	ReviewerID      *uint
	Reviewer        User       `gorm:"foreignKey:ReviewerID"`
	ReviewTime      *time.Time
	ReviewComments  string `gorm:"size:255"`
}



// 请假申请表
type LeaveApplication struct {
	gorm.Model
	TeacherID       uint      `gorm:"index"`
	Teacher         Teacher   `gorm:"foreignKey:TeacherID"`
	StartDate       time.Time `gorm:"not null"`
	EndDate         time.Time `gorm:"not null"`
	LeaveType       int       `gorm:"not null"` // 1-病假 2-事假 3-其他
	Reason          string    `gorm:"size:255;not null"`
	Status          int       `gorm:"default:0"` // 0-待审核 1-已批准 2-已拒绝
	ReviewerID      *uint
	Reviewer        User       `gorm:"foreignKey:ReviewerID"`
	ReviewTime      *time.Time
	ReviewComments  string `gorm:"size:255"`
	AffectedCourses []CourseSchedule `gorm:"many2many:leave_affected_courses;"`
}

// 教师考勤记录表
type Attendance struct {
	gorm.Model
	TeacherID    uint      `gorm:"index"`
	Teacher      Teacher   `gorm:"foreignKey:TeacherID"`
	ScheduleID   uint      `gorm:"index"`
	Schedule     CourseSchedule `gorm:"foreignKey:ScheduleID"`
	Date         time.Time `gorm:"not null"`
	Status       int       `gorm:"default:1"` // 1-正常 2-迟到 3-早退 4-缺勤 5-请假
	RecordedBy   *uint     // 改为指针类型
	Recorder     User   `gorm:"foreignKey:RecordedBy"`
	Remarks      string `gorm:"size:255"`
}

// 系统设置表
type SystemSetting struct {
	gorm.Model
	SettingKey   string `gorm:"uniqueIndex;size:50;not null"`
	SettingValue string `gorm:"type:text"`
	Description  string `gorm:"size:255"`
	Type         string `gorm:"size:20"` // text, number, boolean, json
}

// 公告表
type Announcement struct {
	gorm.Model
	Title      string    `gorm:"size:100;not null"`
	Content    string    `gorm:"type:text;not null"`
	StartDate  time.Time `gorm:"not null"`
	EndDate    time.Time
	IsImportant bool     `gorm:"default:false"`
	PublisherID uint     
	Publisher   User     `gorm:"foreignKey:PublisherID"`
	TargetRoles []Role   `gorm:"many2many:announcement_roles;"`
}

// GORM 数据库迁移函数
func AutoMigrate(db *gorm.DB) error {
	// 禁用外键约束检查，解决迁移顺序问题
	db.Exec("SET FOREIGN_KEY_CHECKS = 1")

	err := db.AutoMigrate(
		&User{},
		&Role{},
		&Permission{},
		&Department{},
		&Major{},
		&Classroom{},
		&Semester{},
		&Course{},
		&Teacher{},
		&CourseSchedule{},
		&CourseAdjustment{},
		&LeaveApplication{},
		&Attendance{},
		&SystemSetting{},
		&Announcement{},
	)

	// 重新启用外键约束
	db.Exec("SET FOREIGN_KEY_CHECKS = 1")
	
	return err
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
    "log"
	"manager-server/model"
)

var DB *gorm.DB

// 初始化数据库连接 (包含连接池配置)
func InitDB() (*gorm.DB, error) {
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
		return nil, fmt.Errorf("数据库连接失败: %v", err)
	}

	// 配置连接池
	sqlDB, _ := DB.DB()
	sqlDB.SetMaxIdleConns(10)  // 空闲连接数
	sqlDB.SetMaxOpenConns(100) // 最大打开连接数

	// 自动迁移数据库模型
	// 检查是否需要迁移（只在表不存在时执行）
    if !tableExists(DB) {
        if err := models.AutoMigrate(DB); err != nil {
            log.Fatalf("Database migration failed: %v", err)
        }
        log.Println("Database migration completed")
    }

	return DB,nil
}

// 获取数据库连接
func GetDB() *gorm.DB {
	return DB
}

 // 检查一个核心表是否存在，如果存在则假设数据库已经迁移
func tableExists(db *gorm.DB) bool {
    return db.Migrator().HasTable(&models.User{}) && 
           db.Migrator().HasTable(&models.Teacher{})
}
```