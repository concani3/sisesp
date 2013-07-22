<#--
Header section of the GetFeatureInfo HTML output. Should have the <head> section, and
a starter of the <body>. It is advised that eventual css uses a special class for featureInfo,
since the generated HTML may blend with another page changing its aspect when usign generic classes
like td, tr, and so on.
-->
<html>
  <head>
    <title>Geoserver GetFeatureInfo output</title>
  </head>
  <style type="text/css">
        table.featureInfo, table.featureInfo td, table.featureInfo th {
                border:1px solid #ddd;
                border-collapse:collapse;
                margin:0;
                padding:0;
                font-size: 100%;
                padding:.4em .4em;
        }
        table.featureInfo th{
            padding:.4em .4em;
                text-transform:capitalize;
                font-weight:bold;
                background:#73BE14;
        }
        table.featureInfo td{
                background:#CCF5D7;
        }
        table.featureInfo tr.odd td{
                background:#E6DFB0;
        }
        table.featureInfo caption{
                text-align:left;
                font-size:100%;
                font-weight:bold;
                text-transform:capitalize;
                padding:.6em .6em;
        }
  </style>
  <body>
