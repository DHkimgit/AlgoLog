import requests
import re
from bs4 import BeautifulSoup
import json

def crawl_boj_name_tags(number: int):
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
    tbody = soup.find('tbody')
    tds = tbody.find_all('td')
    percentage = tds[-1].text.strip()
    paragraphs = [p.get_text() for p in soup.find_all('p')]

    findtag = soup_tag.find_all('script', {'id': '__NEXT_DATA__'})

    findtags = findtag[0].get_text()

    findtag_json = json.loads(findtags)

    tagsraw = findtag_json["props"]['pageProps']['problems']['items'][0]['tags']
    level_num = findtag_json["props"]['pageProps']['problems']['items'][0]['level']
    tiers = [
    "Unrated",
    "Bronze V", "Bronze IV", "Bronze III", "Bronze II", "Bronze I",
    "Silver V", "Silver IV", "Silver III", "Silver II", "Silver I",
    "Gold V", "Gold IV", "Gold III", "Gold II", "Gold I",
    "Platinum V", "Platinum IV", "Platinum III", "Platinum II", "Platinum I",
    "Diamond V", "Diamond IV", "Diamond III", "Diamond II", "Diamond I",
    "Ruby V", "Ruby IV", "Ruby III", "Ruby II", "Ruby I"
    ]
    level = tiers[level_num]
    tages = []

    for i in range(len(tagsraw)):
        tag = tagsraw[i]['displayNames'][0]['short']
        tages.append(tag)

    print(tages)
        
        # 결과 반환
    return {
        "name": title,
        "percentage": percentage,
        "tiers": level,
        "tags": tages
    }

async def crawl_solved_problem_number(id: str):
    headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
    response = requests.get(f"https://www.acmicpc.net/user/{id}", headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    find_problem_list = soup.find_all('div', {'class': 'problem-list'})
    pattern = r'\d+'
    numbers = []
    for link in find_problem_list[0].find_all('a'):
        match = re.search(pattern, link.get_text())
        if match:
            numbers.append(int(match.group()))
    return numbers

async def crawl_failed_problem_number(id: str):
    headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
    response = requests.get(f"https://www.acmicpc.net/user/{id}", headers=headers)
    soup = BeautifulSoup(response.content, 'html.parser')
    find_problem_list = soup.find_all('div', {'class': 'problem-list'})
    #print(find_problem_list)
    problem_list = soup.find('h3', text='시도했지만 맞지 못한 문제').find_parent('div').find_parent('div').find_all('a')
    print(problem_list)
    problem_ids = [int(a.text) for a in problem_list]
    print(problem_ids)
    return problem_ids