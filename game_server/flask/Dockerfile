# Base 이미지 설정
FROM python:3.7-slim

# 작업 디렉토리 설정
WORKDIR /app

# 호스트 시스템에 있는 파일들을 컨테이너 내 /app 디렉토리로 복사
COPY . /app



# 파일의 실행 권한을 설정 (fpcalc.exe 파일에 실행 권한을 부여합니다)
#RUN chmod +x fpcalc

# Flask 앱을 실행하기 위한 종속성 설치
RUN pip install --no-cache-dir -r requirements.txt

# fpcalc 다운로드 및 설치
#RUN apt-get update 
#RUN apt-get -y install sudo
#RUN sudo apt update
#RUN sudo apt install wget
#RUN sudo apt install wget
#RUN sudo wget https://github.com/acoustid/chromaprint/releases/download/v1.4.3/chromaprint-fpcalc-1.4.3-linux-x86_64.tar.gz
#RUN sudo tar -zxvf chromaprint-fpcalc-1.4.3-linux-x86_64.tar.gz && \
    
#rm -rf chromaprint-fpcalc-1.4.3-linux-x86_64 && \
# rm chromaprint-fpcalc-1.4.3-linux-x86_64.tar.gz

# 컨테이너 내에서 실행할 명령 설정
CMD ["python", "app.py"]
