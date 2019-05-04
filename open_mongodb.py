# -*- coding: utf-8 -*
import os

if os.path.exists("database") == False:
	os.mkdir("database")
	print("[OPEN MONGODB]创建数据库目录")
else:
	print("[OPEN MONGODB]数据库目录已存在")
os.system("mongod --dbpath=database")

