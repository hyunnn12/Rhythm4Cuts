import openai
from pydub import AudioSegment
import math
from difflib import SequenceMatcher
from correlation import correlate
from splitter import portion_splitter
import pymysql

# MySQL database properties
host = 'i9b109.p.ssafy.io'
user = '9ithubB109_simons'
password = 'zlwhsalsrnrWid7991'
db = 'rhythm'
charset = 'utf8'

# host = 'localhost'
# user = 'root'
# password = '0000'
# db = 'rhythm'
# charset = 'utf8'

# Establishing a connection
conn = pymysql.connect(
    host=host,
    user=user,
    password=password,
    db=db,
    charset=charset
)

"""
만일 필요한 경우, 쓰게 될 파일 쪼개는 클래스
ex) 파라미터 예시
folder = "C://Users//SSAFY//Downloads"
file = "naul"
ext = ".wav"
ex) 사용 예시
split_wav = SplitWavAudioMubin(folder, file, ext)
split_wav.multiple_split(min_per_split=1)
결과는 Downloads 디렉터리에 '번호_파일명.wav'의 파일들 생성
"""

#portion_splitter(file_name, start_sec, end_sec)
def splitter(game_seq, song_seq, file_name):
    print("[Execute] splitter")

    # Load the input WAV file
    input_wav = AudioSegment.from_wav(file_name)

    global conn
    cursor = conn.cursor()

    cursor.execute("select * from lyrics where song_seq = %s order by lyrics_seq", song_seq)
    lyricsPart = cursor.fetchall()

    for i in range(len(lyricsPart)):
        lyrics_seq, end_time, lyric, song_order, start_time, song_seq = lyricsPart[i]
        print(lyrics_seq, start_time, end_time)
        portion_splitter(file_name, start_time, end_time, i)

    return

# 곡명, 파트로 매개변수 변경 필요
def getLyricsScore(song_seq, lyrics_idx, file):
    try:
        OPENAI_API_KEY = "#"
        openai.api_key = OPENAI_API_KEY

        global conn
        cur = conn.cursor()

        cur.execute("SELECT lyric FROM lyrics WHERE song_seq = %s AND lyrics_seq = %s", (song_seq, lyrics_idx))

        lyricsAnswer = cur.fetchone()

        # 음성 인식
        # transcript = openai.Audio.transcribe("whisper-1", audio_file)
        transcript = openai.Audio.transcribe("whisper-1", file)
        print("userLyrics : " + transcript['text'])
        # 사용자 입력 가사
        userLyrics = transcript['text']

        lyricsAccuracy = SequenceMatcher(None, lyricsAnswer[0], userLyrics)

        print(lyricsAccuracy)

        # 파일을 원하는 방식으로 처리하는 로직을 작성합니다.
        # 여기에서는 가사 정확도를 간단히 리턴하는 예제를 보여줍니다.
        return {
            "score": lyricsAccuracy.ratio() * 100,
            "text": userLyrics
        }
    except Exception as e:
        print(e)

def getMelodyScore(filename, answerFile):
    score = correlate(filename, answerFile)

    return {
        "score": score
    }

def test():
    global conn
    cursor = conn.cursor()
    song_seq = 114

    cursor.execute("SELECT * FROM lyrics WHERE song_seq = %s", song_seq)

    lyricsPart = cursor.fetchall()

    for lyric in lyricsPart:
        #lyrics_seq는 1부터 시작
        lyrics_seq, end_time, lyric, song_order, start_time, song_seq = lyric



# folder = 'C://Users//SSAFY//Downloads'
# file = 'naul'
# ext = '.wav'
# split_wav = SplitWavAudioMubin(folder, file, ext)
# split_wav.multiple_split(min_per_split=1)