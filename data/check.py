import os
import json

#21대 국회의원 & 22대 후보자인데 id_21th가 부여되지 않은 사람을 찾는다.

candidate_file_list = os.listdir(os.path.abspath('./data/candidates'))
os.chdir(os.path.abspath('./data/candidates'))

candidate_data_list = []

for file in candidate_file_list:
	with open(file, 'r', encoding='UTF-8-sig') as f:
		data = json.load(f)
		candidate_data_list.append({ "file_name": file, "data": data })

#id_21th_list
os.chdir(os.path.abspath('../'))
with open('ids_21th.json', 'r', encoding='UTF-8-sig')as file:
	id_21th_list = json.load(file)

#id_21th가 있는 후보자의 id_21th를 id_21th_list에서 제거
for candidate_data in candidate_data_list:
	for candidate in candidate_data["data"]:
		if "id_21th" in candidate:
			id_21th_list.remove(int(candidate["id_21th"]))

#모든 후보자의 이름 리스트
name_list = []
for candidate_data in candidate_data_list:
	for candidate in candidate_data["data"]:
		name_list.append(candidate["이름"])

#id_21th가 부여되지 않은 id의 파일을 열어서 이름을 후보자 리스트에서 찾는다.
not_assigned_list = []
os.chdir(os.path.abspath('./21th-law-makers'))
for i in id_21th_list:
	with open(str(i)+'.json', 'r', encoding="UTF-8-sig")as file:
		_21th_file = json.load(file)
	#후보자 이름중에 있으면 수기로 확인
	if _21th_file["이름"] in name_list:
		not_assigned_list.append(_21th_file["이름"])

print(not_assigned_list)

#김영선, 박병석, 홍익표, 이수진, 이용우, 김병욱
#김영선, 박병석, 이수진, 이용우 : 21대를 지낸 사람과 후보자가 동명이인
#홍익표 : 21대를 지낸 사람이나, 해당 정보가 없음. 직접 작성함
#이수진, 김병욱 : 21대 국회의원 중 동명이인이 있음