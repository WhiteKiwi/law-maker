import os
import json
from operator import itemgetter

#21대 리스트 불러오기
_21th_file_list = os.listdir(os.path.abspath('./data/21th-law-makers'))

os.chdir(os.path.abspath('./data/21th-law-makers'))

_21th_data_list = []

for file in _21th_file_list:
	with open(file, 'r', encoding='UTF-8-sig') as f:
		_21th_data_list.append(json.load(f))

#21대 등수 매기기에 이용할 리스트
_21th_list = []

#본회의_출석률, 대표발의법안 정리된 리스트 생성
for _21th in _21th_data_list:
	_21th_list.append({"id" : _21th["id"], "attendance": _21th["본회의_출석률"], "lawPropose" : _21th["대표발의법안"]})

#--------재산등수 매기기 위한 작업-------
#21대 국회의원이었던 후보자 불러오기
os.chdir(os.path.abspath('../'))

candidate_file_list = os.listdir(os.path.abspath('./candidates'))
os.chdir(os.path.abspath('./candidates'))

candidate_list =[]

for file in candidate_file_list:
	with open(file, 'r', encoding="UTF-8-sig")as f:
		data = json.load(f)
		for i in range(len(data)):
			if "id_21th" in data[i]:
				candidate_list.append(data[i])

#연 평균 재산 증감액 구하기
os.chdir(os.path.abspath('../'))
os.chdir(os.path.abspath('./21th-law-makers'))

no_increase_list = []
has_increase_list = []

for candidate in candidate_list:
	with open(candidate["id_21th"]+'.json', 'r', encoding="UTF-8-sig")as f:
		data = json.load(f)
		if len(data["연도별_재산"]) != 0:
			estate = data["연도별_재산"][0]["재산"]
			year = data["연도별_재산"][0]["연도"]
			has_increase_list.append({"id" : candidate["id_21th"], "estate_increase" : (candidate["재산"] - estate)/(2024-year)})

#--------21대 국회의원이었던 후보자의 재산 계산완료. has_increase_list에 id_21th와 재산증감액이 들어가있음---------

#21대 국회의원 id 모두 가져오기
os.chdir(os.path.abspath('../'))
with open('ids_21th.json', 'r', encoding='UTF-8-sig')as file:
	id_list = json.load(file)

#21대이면서 후보자인 사람의 id_21th 리스트
_21thNcandidate_id_list = []
for candidate in candidate_list:
	_21thNcandidate_id_list.append(int(candidate["id_21th"]))

a = set(_21thNcandidate_id_list)
b = set(id_list)

#전체에서 21대이면서 후보자인 사람을 제거한다.
id_list = list(b - a)

#21대이면서 후보자인 사람을 제외하고 재산증감액을 계산한다. 
os.chdir(os.path.abspath('./21th-law-makers'))
for id in id_list:
	with open(str(id)+'.json', 'r', encoding="UTF-8-sig")as f:
		data = json.load(f)
		#재산 정보가 하나이거나 없으면 id만 no_increase_list에 넣는다.
		if len(data["연도별_재산"]) == 1 or len(data["연도별_재산"]) == 0:
			no_increase_list.append({"id" : id})
		#재산 정보가 여러개면 증감액을 계산해 has_increase_list에 넣는다. 
		else:
			has_increase_list.append({"id" : id, "estate_increase" : (data["연도별_재산"][-1]["재산"] - data["연도별_재산"][0]["재산"])/(data["연도별_재산"][-1]["연도"] - data["연도별_재산"][0]["연도"])})

#증감액 정보가 없으면 재산등수를 -1로 넣는다.
for i in range(len(no_increase_list)):
		with open(str(no_increase_list[i]["id"])+'.json', 'r', encoding='UTF-8-sig') as f:
			_21th = json.load(f)
			_21th["재산등수"] = -1
		with open(str(no_increase_list[i]["id"])+'.json', 'w', encoding='UTF-8-sig') as file:
			file.write(json.dumps(_21th, file, indent="\t", ensure_ascii=False))

#등수를 저장하는 리스트
global _21th_rank
_21th_rank = []

#리스트를 특정 키값으로 정렬하여 등수를 _21th_rank에 저장하는 함수
def rankSort(type, _21th_list):
	global _21th_rank
	_21th_rank = []
	_21th_list.sort(key=itemgetter(type), reverse=True)
	rank = 1

	tmp = _21th_list[0][type]

	for _21th in _21th_list:
		if tmp != _21th[type]:
			rank +=1
		_21th_rank.append(rank)
		tmp = _21th[type]

#리스트와 rank정보를 토대로 등수를 파일에 작성하는 함수
def fileWrite(type, _21th_list):
	for i in range(len(_21th_list)):
		with open(str(_21th_list[i]["id"])+'.json', 'r', encoding='UTF-8-sig') as f:
			_21th = json.load(f)
			_21th[type] = _21th_rank[i]
		with open(str(_21th_list[i]["id"])+'.json', 'w', encoding='UTF-8-sig') as file:
			file.write(json.dumps(_21th, file, indent="\t", ensure_ascii=False))

rankSort("estate_increase", has_increase_list)
fileWrite("재산등수", has_increase_list)

rankSort("attendance", _21th_list)
fileWrite("본회의_출석률_등수", _21th_list)

rankSort("lawPropose", _21th_list)
fileWrite("대표발의법안_등수", _21th_list)

