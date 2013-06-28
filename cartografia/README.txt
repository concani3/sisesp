Sobre a cartografia algumas orientações e observações.

1) Upload máximo no gitHUB
O GitHub só aceita uploads até 100MB.  Normalmente os arquivos de cartografia possuem tamanhos grandes, agumas vezes até acima de 1GB. 
Portanto, nem toda a cartografia utilizada será disponibilizada através do GitHub.

Cartografia que não fora disponibilizada pelo GitHub:
-----------------------------------------------------
- lotes do DF (arquivos shapefiles df_lote).


2) Arquivos de planilha
Foram disponibilizadas planilhas com informações geográficas.  É muito fácil gerar um shapefile a partir destas e, se necessário, inserir estas informações do PostGIS.

Passo-1: salvar como csv, como  separador adotar a vírgula;
Passo-2: gerar o shapefile.  Utilizar, por exemplo, o aplicativo Qgis;
Passo-3: inserir as informações no banco postgis: usar comandos shp2pgsql e psql.

3) Arquivos SLD
São arquivos de Styled Layer Descriptor,  utilizados pelo GeoServer.  Devem estar disponíveis para utilização por este aplicativo.
