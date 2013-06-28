<?xml version="1.0" encoding="ISO-8859-1"?>
  <StyledLayerDescriptor version="1.0.0"
    xsi:schemaLocation="http://www.opengis.net/sld StyledLayerDescriptor.xsd"
    xmlns="http://www.opengis.net/sld"
    xmlns:ogc="http://www.opengis.net/ogc"
    xmlns:xlink="http://www.w3.org/1999/xlink"
    xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">
<NamedLayer>
    <Name>Municipios da RIDE</Name>
    <UserStyle>
      <Title>Portal da Geoinformacao</Title>
      <FeatureTypeStyle>
        <Rule>
          <TextSymbolizer>
             <Label>
               <ogc:PropertyName>municipio</ogc:PropertyName>
             </Label>
             <Font>
               <CssParameter name="font-family">Arial</CssParameter>
               <CssParameter name="font-size">8</CssParameter>
               <CssParameter name="font-style">normal</CssParameter>
               <CssParameter name="font-weight">bold</CssParameter>
             </Font>
             <LabelPlacement>
               <PointPlacement>
                 <AnchorPoint>
                   <AnchorPointX>0</AnchorPointX>
                   <AnchorPointY>0</AnchorPointY>
                 </AnchorPoint>
                 <Displacement>
                   <DisplacementX>2</DisplacementX>
                   <DisplacementY>5</DisplacementY>
                 </Displacement>
               </PointPlacement>
             </LabelPlacement>
            <Fill>
              <CssParameter name="fill">#8B7D7D#</CssParameter>
            </Fill>
            <VendorOption name="autoWrap">50</VendorOption>
            <VendorOption name="maxDisplacement">250</VendorOption>
          </TextSymbolizer>
        </Rule>
      </FeatureTypeStyle>
    </UserStyle>
  </NamedLayer>
</StyledLayerDescriptor>
