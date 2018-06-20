# coding=utf-8
import xlrd
import json
from flask import Flask, request

global_dict = {}
global_app = Flask(__name__)

# global_app.run('localhost', debug=True, port=5000, ssl_context='adhoc')

def main():
	[valid, dic] = validFiles()
	if not valid:
		return

	startHTTPServer(dic)


def validFiles():
	workbook = xlrd.open_workbook('order.xlsx')
	sheet = workbook.sheet_by_name(u"Sheet1")

	result = {}
	for rownum in range(sheet.nrows):
		values = sheet.row_values(rownum)
		originOrder = values[0]
		transCompany = values[1]
		transOrder = values[2]

		if not originOrder or not transOrder or not transCompany:
			print('第%s行内容有误' % (rownum + 1))
			workbook.release_resources()
			return [False, None]

		if originOrder in result:
			print('第%s行已存在' % (rownum + 1))
			workbook.release_resources()
			return [False, None]

		result[originOrder] = {"transOrder": transOrder, "transCompany": transCompany}

	workbook.release_resources()
	return [True, result]

@global_app.route("/")
def httpEntryPoint():
	jsonp = request.args.get("callbackparam")

	[valid, dic] = validFiles()
	if not valid:
		sendJson = {"status": "fail", "message": "配置文件有问题，请修正"}
		return formatSendJson(jsonp, sendJson)

	global_dict = dic

	key = request.args.get("key")
	if not key:
		sendJson = {"status": "fail", "message": "key不能为空"}
		return formatSendJson(jsonp, sendJson)

	if key in global_dict:
		value = global_dict[key]
		sendJson = {"status": "success", "message": value}
		return formatSendJson(jsonp, sendJson)
	else:
		sendJson = {"status": "fail", "message": '找不到对应的值: %s' % key}
		return formatSendJson(jsonp, sendJson)

def formatSendJson(jsonp, jsonData):
	return formatSendString(jsonp, json.dumps(jsonData))

def formatSendString(jsonp, message):
	message = message.replace("'", "\\'")
	return '%s(\'%s\')' % (jsonp, message)

def startHTTPServer(dic):
	global_dict = dic

	global_app.run()


if __name__== '__main__':
	main()
