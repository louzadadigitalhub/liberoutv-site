#!/usr/bin/env python3
"""Gera o provedor de demonstração: as respostas de um servidor Xtream Codes em
arquivos fixos (demo/api/*.json), servidas pelo nginx do site em /player_api.php.
Os vídeos não ficam aqui: /live/, /movie/ e /series/ redirecionam para as fontes
oficiais (nginx/demo-midia.conf, gerado junto).

Serve à revisão das lojas (Apple, Google, Samsung, LG, Roku): o revisor entra com
o código do painel que aponta para https://app.liberoutv.com e com a conta de
revisão abaixo, e só encontra conteúdo de licença livre:

- filmes e curtas abertos da Blender Foundation (Creative Commons, com o crédito
  na sinopse de cada um), hospedados no Internet Archive e no servidor da Blender;
- os vídeos de teste da Apple e da Mux, feitos para testar reprodutores.

Rodar de novo depois de mudar a lista:  python3 demo/gerar.py
"""
import json
import os

AQUI = os.path.dirname(os.path.abspath(__file__))
SITE = "https://app.liberoutv.com"
USUARIO, SENHA = "revisao", "liberou2026"

ARCHIVE = "https://archive.org/download"

# ------------------------------------------------------------------ canais
# (id, nome, categoria, endereço HLS)
CANAIS = [
    (101, "Apple Teste de Imagem HD", "1",
     "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_ts/master.m3u8"),
    (102, "Apple Teste de Imagem 4K", "1",
     "https://devstreaming-cdn.apple.com/videos/streaming/examples/img_bipbop_adv_example_fmp4/master.m3u8"),
    (201, "Cinema Aberto: Big Buck Bunny", "2", "https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"),
    (202, "Cinema Aberto: Tears of Steel", "2", "https://test-streams.mux.dev/tos_ismc/main.m3u8"),
]
CATEGORIAS_CANAIS = [("1", "TESTE DE IMAGEM"), ("2", "CINEMA ABERTO 24H")]

# ------------------------------------------------------------------ filmes
BLENDER = "© Blender Foundation | www.blender.org"
FILMES = [
    dict(id=1001, nome="Big Buck Bunny", ano="2008", ext="mp4", capa="bbb.jpg", nota="7.2", duracao="00:09:56",
         genero="Animação, Comédia",
         url=f"{ARCHIVE}/BigBuckBunny_124/Content/big_buck_bunny_720p_surround.mp4",
         sinopse="Um coelho grande e gentil resolve dar o troco em três roedores que vivem aprontando "
                 f"com os bichos da floresta. Filme aberto. {BLENDER}, licença CC BY 3.0."),
    dict(id=1002, nome="Sintel", ano="2010", ext="mp4", capa="sintel.jpg", nota="7.5", duracao="00:14:48",
         genero="Animação, Aventura",
         url=f"{ARCHIVE}/Sintel/sintel-2048-surround.mp4",
         sinopse="Uma jovem atravessa terras geladas em busca do filhote de dragão que criou. "
                 f"Filme aberto. {BLENDER}, licença CC BY 3.0."),
    dict(id=1003, nome="Tears of Steel", ano="2012", ext="mov", capa="tos.jpg", nota="6.8", duracao="00:12:14",
         genero="Ficção científica",
         url="https://download.blender.org/demo/movies/ToS/tears_of_steel_720p.mov",
         sinopse="Em Amsterdã, um grupo de cientistas tenta salvar o mundo de robôs vindos do futuro. "
                 f"Filme aberto. {BLENDER}, licença CC BY 3.0."),
    dict(id=1004, nome="Elephants Dream", ano="2006", ext="mp4", capa="ed.jpg", nota="6.5", duracao="00:10:53",
         genero="Animação, Ficção",
         url=f"{ARCHIVE}/ElephantsDream/ed_hd.mp4",
         sinopse="Dois homens percorrem uma máquina infinita e enxergam nela coisas diferentes. "
                 f"O primeiro filme aberto da Blender. {BLENDER}, licença CC BY 2.5."),
]
CATEGORIAS_FILMES = [("10", "FILMES ABERTOS")]

# ------------------------------------------------------------------ série
SERIE = dict(id=2001, nome="Curtas da Blender", capa="sprite.jpg", ano="2021", nota="7.8", genero="Animação",
             sinopse=f"Curtas abertos do estúdio da Blender. {BLENDER}, licenças Creative Commons.")
EPISODIOS = [  # (id, título, capa, duração em segundos, endereço, sinopse)
    (200101, "Sprite Fright", "sprite.jpg", 629,
     f"{ARCHIVE}/sprite-fright/Sprite%20Fright%20-%20Open%20Movie%20by%20Blender%20Studio-804p.mp4",
     "Um grupo de adolescentes acampa na floresta errada. Licença CC BY 4.0."),
    (200102, "Agent 327: Operation Barbershop", "agent.jpg", 231,
     f"{ARCHIVE}/agent327operationbarbershop/agent327-1080.mp4",
     "O agente secreto 327 investiga uma barbearia suspeita. Licença CC BY-ND 4.0."),
]
CATEGORIAS_SERIES = [("20", "CURTAS ABERTOS")]


def img(nome):
    return f"{SITE}/demo-img/{nome}"


def grava(nome, dados):
    with open(os.path.join(AQUI, "api", nome + ".json"), "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, separators=(",", ":"))


def categorias(lista):
    return [{"category_id": c, "category_name": n, "parent_id": 0} for c, n in lista]


def main():
    os.makedirs(os.path.join(AQUI, "api"), exist_ok=True)

    grava("auth", {
        "user_info": {"auth": 1, "status": "Active", "username": USUARIO, "exp_date": "1924988400",
                      "is_trial": "0", "active_cons": "0", "max_connections": "2",
                      "allowed_output_formats": ["m3u8", "ts"]},
        "server_info": {"url": "app.liberoutv.com", "port": "443", "https_port": "443",
                        "server_protocol": "https", "timezone": "America/Sao_Paulo"},
    })
    grava("negado", {"user_info": {"auth": 0}})
    grava("vazio", [])
    grava("epg", {"epg_listings": []})

    grava("live_categories", categorias(CATEGORIAS_CANAIS))
    grava("vod_categories", categorias(CATEGORIAS_FILMES))
    grava("series_categories", categorias(CATEGORIAS_SERIES))

    canais = [{"num": i + 1, "name": nome, "stream_type": "live", "stream_id": sid, "stream_icon": "",
               "epg_channel_id": "", "category_id": cat, "is_adult": 0, "tv_archive": 0}
              for i, (sid, nome, cat, _) in enumerate(CANAIS)]
    grava("live_streams", canais)
    for cat, _ in CATEGORIAS_CANAIS:
        grava("live_streams_" + cat, [c for c in canais if c["category_id"] == cat])

    filmes = [{"num": i + 1, "name": f"{f['nome']} ({f['ano']})", "stream_type": "movie", "stream_id": f["id"],
               "stream_icon": img(f["capa"]), "rating": f["nota"], "added": "1761500000",
               "category_id": "10", "container_extension": f["ext"], "year": f["ano"]}
              for i, f in enumerate(FILMES)]
    grava("vod_streams", filmes)
    grava("vod_streams_10", filmes)
    for f in FILMES:
        grava(f"vod_info_{f['id']}", {
            "info": {"name": f["nome"], "plot": f["sinopse"], "cast": "", "director": "Blender Foundation",
                     "genre": f["genero"], "releasedate": f"{f['ano']}-01-01", "rating": f["nota"],
                     "duration": f["duracao"], "movie_image": img(f["capa"]), "cover_big": img(f["capa"]),
                     "backdrop_path": [img(f["capa"])]},
            "movie_data": {"stream_id": f["id"], "name": f["nome"], "container_extension": f["ext"]},
        })

    serie = [{"num": 1, "name": SERIE["nome"], "series_id": SERIE["id"], "cover": img(SERIE["capa"]),
              "plot": SERIE["sinopse"], "genre": SERIE["genero"], "releaseDate": f"{SERIE['ano']}-01-01",
              "rating": SERIE["nota"], "category_id": "20"}]
    grava("series", serie)
    grava("series_20", serie)
    grava(f"series_info_{SERIE['id']}", {
        "info": {"name": SERIE["nome"], "plot": SERIE["sinopse"], "cast": "", "director": "Blender Studio",
                 "genre": SERIE["genero"], "releaseDate": f"{SERIE['ano']}-01-01", "rating": SERIE["nota"],
                 "cover": img(SERIE["capa"]), "backdrop_path": [img(SERIE["capa"])]},
        "seasons": [{"season_number": 1, "name": "Temporada 1", "cover": img(SERIE["capa"])}],
        "episodes": {"1": [{"id": str(eid), "episode_num": n + 1, "title": titulo, "container_extension": "mp4",
                            "season": 1,
                            "info": {"duration_secs": dur, "plot": sinopse, "movie_image": img(capa)}}
                           for n, (eid, titulo, capa, dur, _, sinopse) in enumerate(EPISODIOS)]},
    })

    # os endereços dos vídeos, para o nginx redirecionar
    linhas = ["# Gerado por demo/gerar.py: para onde vai cada vídeo do provedor de demonstração.",
              "map $uri $demo_midia {", '    default "";']
    for sid, _, _, url in CANAIS:
        linhas.append(f"    ~^/live/[^/]+/[^/]+/{sid}\\.[a-z0-9]+$ {url};")
    for f in FILMES:
        linhas.append(f"    ~^/movie/[^/]+/[^/]+/{f['id']}\\.[a-z0-9]+$ {f['url']};")
    for eid, _, _, _, url, _ in EPISODIOS:
        linhas.append(f"    ~^/series/[^/]+/[^/]+/{eid}\\.[a-z0-9]+$ {url};")
    linhas.append("}")
    with open(os.path.join(AQUI, "..", "nginx", "demo-midia.conf"), "w", encoding="utf-8") as f:
        f.write("\n".join(linhas) + "\n")


if __name__ == "__main__":
    main()
