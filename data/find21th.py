import os
import json

_21th_file_list = os.listdir(os.path.abspath('./data/21th-law-makers'))

os.chdir(os.path.abspath('./data/21th-law-makers'))

_21th_data_list = []

for file in _21th_file_list:
	with open(file, 'r', encoding='UTF-8-sig') as f:
		_21th_data_list.append(json.load(f))


os.chdir(os.path.abspath('../'))

candidate_file_list = os.listdir(os.path.abspath('./candidates'))
os.chdir(os.path.abspath('./candidates'))

candidate_data_list = []

for file in candidate_file_list:
	with open(file, 'r', encoding='UTF-8-sig') as f:
		data = json.load(f)
		candidate_data_list.append({ "file_name": file, "data": data })

for _21th in _21th_data_list:
	for candidate_data in candidate_data_list:
			for candidate in candidate_data["data"]:
				if _21th['이름'] == candidate['이름']:
					if '국회의원' in candidate['직업']:
						candidate['id_21th'] = _21th["id"]
						with open(candidate_data["file_name"], 'w', encoding='UTF-8-sig') as file:
							file.write(json.dumps(candidate_data["data"], file, indent="\t", ensure_ascii=False))
					else:
						career = candidate['경력'].split('\n')
						for j in range(len(career)):
							if ('현' in career[j] or '21' in career[j]) and '국회의원' in career[j]:
								candidate['id_21th'] = _21th["id"]
								with open(candidate_data["file_name"], 'w', encoding='UTF-8-sig') as file:
									file.write(json.dumps(candidate_data["data"], file, indent="\t", ensure_ascii=False))
