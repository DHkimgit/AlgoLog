headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3'
        }
response = requests.get(f"https://www.acmicpc.net/user/{id}", headers=headers)
soup = BeautifulSoup(response.content, 'html.parser')
find_problem_list = soup.find_all('div', {'class': 'problem-list'})
pattern = r'\d+'
print(find_problem_list[0])
numbers = []
for link in find_problem_list[0].find_all('a'):
    match = re.search(pattern, link.get_text())
    if match:
        numbers.append(int(match.group()))


    