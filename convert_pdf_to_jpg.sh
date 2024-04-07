#!/bin/bash

# PDF 파일이 있는 폴더로 이동
cd /Users/kiwi.jang/Desktop/whitekiwi/lawmaker/vote-for.kr/공보

# 폴더 내의 모든 PDF 파일을 JPG로 변환
for file in *.pdf; do
    echo "변환 중: $file"
    # 파일 이름에서 확장자를 제외
    filename="${file%.pdf}"
    
    # ImageMagick을 사용하여 PDF를 JPG로 변환
    convert -density 300 "$file" -quality 90 "images/${filename}.jpg"
done

echo "변환 완료."
