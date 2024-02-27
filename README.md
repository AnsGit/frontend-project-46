### Описание

Проект "Вычислитель отличий"

Позволяет найти разницу между двумя json, yaml или yml файлами и вывести ее в одном из 3 форматов:

- `stylish` - выводит изменения по каждому свойству в иерархическом стиле;

- `plain` - выводит изменения по свойствам в понятном обывателю тестовом виде (свойства, которые не были модифицированы, не выводятся);

- `json` - выводит конечный результат в виде json-объекта.

### Подготовка к работе

#### Установка зависимостей

```
make install // если не сработает, то можно исползовать npm install
```

#### Публикация пакета

```
make publish
sudo npm link
```

### Запуск

```
gendiff --format stylish file1.json file2.json
gendiff --format plain file1.yml file2.json
gendiff --format json file1.json file2.yaml
```

### Hexlet tests and linter status:

[![Actions Status](https://github.com/AnsGit/frontend-project-46/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/AnsGit/frontend-project-46/actions)

<a href="https://codeclimate.com/github/AnsGit/frontend-project-46/maintainability"><img src="https://api.codeclimate.com/v1/badges/df3e14f25edba304dd64/maintainability" /></a>

<a href="https://codeclimate.com/github/AnsGit/frontend-project-46/test_coverage"><img src="https://api.codeclimate.com/v1/badges/df3e14f25edba304dd64/test_coverage" /></a>
