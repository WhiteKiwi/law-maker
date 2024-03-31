import os
import json

candidate_file_list = os.listdir(os.path.abspath('./data/candidates'))
os.chdir(os.path.abspath('./data/candidates'))

candidate_data_list = []

for file in candidate_file_list:
	with open(file, 'r', encoding='UTF-8-sig') as f:
		data = json.load(f)
		candidate_data_list.append({ "file_name": file, "data": data })

os.chdir(os.path.abspath('../'))
with open('ids_21th.json', 'r', encoding='UTF-8-sig')as file:
	id_list = json.load(file)

id_in_cand_list = []
for candidate_data in candidate_data_list:
	for candidate in candidate_data["data"]:
		if "id_21th" in candidate:
			id_list.remove(int(candidate["id_21th"]))

name_list = []
for candidate_data in candidate_data_list:
	for candidate in candidate_data["data"]:
		name_list.append(candidate["이름"])

same_list = []
os.chdir(os.path.abspath('./21th-law-makers'))
for i in id_list:
	with open(str(i)+'.json', 'r', encoding="UTF-8-sig")as file:
		_21th_file = json.load(file)
	if _21th_file["이름"] in name_list:
		same_list.append(_21th_file["id"])

print(same_list)