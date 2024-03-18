from fastapi import FastAPI
from fastapi import APIRouter
import requests
from bs4 import BeautifulSoup
import json
from app.crawl.logic import crawl_solved_problem_number
from app.crawl.database import(
    add_problem_data,
    add_tag_data,
    retrive_tag_data
)

router = APIRouter()

@router.get("/")
async def crawl_website(number: int):
    try:
        # 웹사이트 요청
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
        response = requests.get(f"https://www.acmicpc.net/problem/{number}", headers=headers)
        response_tag = requests.get(f"https://solved.ac/search?query={number}&page=1", headers=headers)
        response.raise_for_status()
        

        # HTML 파싱
        soup = BeautifulSoup(response.content, 'html.parser')
        soup_tag = BeautifulSoup(response_tag.content, 'html.parser')
        
        # 원하는 데이터 추출
        title = soup.title.string
        # <tbody> 태그 찾기
        tbody = soup.find('tbody')

        # <tbody> 내의 모든 <td> 태그 찾기
        tds = tbody.find_all('td')

        # 마지막 <td> 태그의 텍스트 추출 (퍼센테이지 값)
        percentage = tds[-1].text.strip()
        print(percentage)
        paragraphs = [p.get_text() for p in soup.find_all('p')]
        
        findtag = soup_tag.find_all('script', {'id': '__NEXT_DATA__'})
        
        findtags = findtag[0].get_text()
        
        findtag_json = json.loads(findtags)

        tagsraw = findtag_json["props"]['pageProps']['problems']['items'][0]['tags']
        level = findtag_json["props"]['pageProps']['problems']['items'][0]['level']
        print(level)

        tages = []

        for i in range(len(tagsraw)):
            tag = tagsraw[i]['displayNames'][0]['short']
            tages.append(tag)

        print(tages)
        
        # 결과 반환
        return {
            "title": title,
            "tages": tages,
            "level": level
        }

    except requests.exceptions.RequestException as e:
        return {"error": str(e)}

@router.get("/problemlist")
async def crawl_problem_list(bojid: str):
    k = crawl_solved_problem_number(bojid)
    print(k)
    return k

@router.post("/problemlist")
async def add_crawled_problem_list(bojid: str):
    user_solved_problem_list = crawl_solved_problem_number(bojid)

    for i in range(len(user_solved_problem_list)):
        k = await add_problem_data(user_solved_problem_list[i])
    
    return user_solved_problem_list
    