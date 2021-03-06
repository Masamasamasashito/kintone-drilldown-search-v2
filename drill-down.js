/*
Presented By
https://4649-24.com
*/
(function() {
  'use strict';
 
/*
①kintone-ui-component.min.js と kintone-ui-component.min.css は https://github.com/kintone/kintone-ui-component　より入手してください。
②以下、CONFIG の各種アプリIDは環境毎に書き換えてください
*/

  const CONFIG ={
      MAIN_APP_ID:155,//Mainアプリ
      REGION_APP_ID:156,//地方アプリ
      PREFECTURE_APP_ID:157,//都道府県アプリ
      CITY_APP_ID:158//市区町村アプリ
  }

  kintone.events.on(['app.record.create.show','app.record.edit.show'], function(event_create_show) {
    let record = event_create_show.record;
    /* Create region query */
    let region_params = {
      "app": CONFIG.REGION_APP_ID,//地方アプリ
      "fields": ["地方名", "地方コード"]
    };

    /* hidden Main App fields */
    kintone.app.record.setFieldShown('地方名_Main', false);
    kintone.app.record.setFieldShown('地方コード_Main', false);
    kintone.app.record.setFieldShown('都道府県名_Main', false);
    kintone.app.record.setFieldShown('都道府県コード_Main', false);
    kintone.app.record.setFieldShown('市区町村名_Main', false);
    kintone.app.record.setFieldShown('市区町村コード_Main', false);
 
    kintone.api(kintone.api.url('/k/v1/records', true), 'GET', region_params, function(region_resp) {
      /* Success */
      let records_region = region_resp.records;
 
      /* Create Region Dropdown Options */
      let region_dropdown_options = [];
      records_region.forEach(function( element, index ){
        let region_dropdown_option = {'label': element.地方名.value, 'value': element.地方コード.value, 'isDisabled':false};
        region_dropdown_options.push(region_dropdown_option);
      });
      
      let regionCode_Main_value = record.地方コード_Main.value;
      let prefectureCode_Main_value = record.都道府県コード_Main.value;
      let cityCode_Main_value = record.市区町村コード_Main.value;

      /* Create Region dropdown kintoneUIComponent Objects */
      let regionlabel = new kintoneUIComponent.Label({text: '地方名'});
      let regiondropdown = new kintoneUIComponent.Dropdown({items:region_dropdown_options,value:regionCode_Main_value});

      /* Reset All Dropdown on space */
      kintone.app.record.getSpaceElement('space_region').innerHTML = "";
      kintone.app.record.getSpaceElement('space_prefecture').innerHTML = "";
      kintone.app.record.getSpaceElement('space_city').innerHTML = "";
      /* Setting Region Dropdown on space */
      kintone.app.record.getSpaceElement('space_region').appendChild(regionlabel.render());
      kintone.app.record.getSpaceElement('space_region').appendChild(regiondropdown.render());
 
      /* in case of app.record.edit.show */
      /* if prefectureCode_Main_value is int , Create Prefecture dropdown kintoneUIComponent Objects */
      if(!isNaN(prefectureCode_Main_value)){
      
      //Get 地方コード_Main records from 都道府県App
      //create kintoneUIComponent items
      //create kintoneUIComponent value by prefectureCode_Main_value
      
    　 let prefecture_params = {
         "app": CONFIG.PREFECTURE_APP_ID,//都道府県アプリ
         "query":"地方コード="+regionCode_Main_value,
         "fields": ["地方コード","都道府県名","都道府県コード"]
     　};
      
        kintone.api(kintone.api.url('/k/v1/records', true), 'GET', prefecture_params, function(prefecture_resp) {
             
          /* Success */
          let records_prefecture = prefecture_resp.records;
     
          /* Create Prefecture Dropdown Options */
          let prefecture_dropdown_options = [];
          records_prefecture.forEach(function( element, index ){
            let prefecture_dropdown_option = {'label': element.都道府県名.value, 'value': element.都道府県コード.value, 'isDisabled':false};
            prefecture_dropdown_options.push(prefecture_dropdown_option);
          });
          
          /* Create Prefecture kintoneUIComponent Objects */
          let prefecturelabel = new kintoneUIComponent.Label({text: '都道府県名'});
          let prefecturedropdown = new kintoneUIComponent.Dropdown({items: prefecture_dropdown_options,value:prefectureCode_Main_value});
     
          /* Reset Prefecture & city Dropdown on space */
          kintone.app.record.getSpaceElement('space_prefecture').innerHTML = "";
          kintone.app.record.getSpaceElement('space_city').innerHTML = "";
          /* Setting Prefecture Dropdown on space */
          kintone.app.record.getSpaceElement('space_prefecture').appendChild(prefecturelabel.render());
          kintone.app.record.getSpaceElement('space_prefecture').appendChild(prefecturedropdown.render());

          /* If change prefecture Dropdown , Insert value '都道府県名_Main' field . */
          prefecturedropdown.on('change', function(value_prefecture) {
            //Get_Main app all records include fields on space_prefecture
            let records_Main_prefecture = kintone.app.record.get();
    
            for(let i=0; i<records_prefecture.length; i++){
              if(value_prefecture == records_prefecture[i].都道府県コード.value){
                records_Main_prefecture['record']['都道府県名_Main']['value'] = records_prefecture[i].都道府県名.value;
                records_Main_prefecture['record']['都道府県コード_Main']['value'] = records_prefecture[i].都道府県コード.value;
              }
            }
            kintone.app.record.set(records_Main_prefecture);
          });
        }, function(error) {
        console.log(error);
        });

      }

      /* in case of app.record.edit.show */
      /* if cityCode_Main_value is int , Create City dropdown kintoneUIComponent Objects */
      if(!isNaN(cityCode_Main_value)){

      //Get 市区町村コード_Main records from 市区町村App
      //create kintoneUIComponent items
      //create kintoneUIComponent value by cityCode_Main_value
      
        let city_params = {
         "app": CONFIG.CITY_APP_ID,//市区町村アプリ
         "query":"都道府県コード="+prefectureCode_Main_value,
         "fields": ["都道府県コード","市区町村名","市区町村コード"]
        };
        
         kintone.api(kintone.api.url('/k/v1/records', true), 'GET', city_params, function(city_resp) {
           /* Success */
           let records_city = city_resp.records;
    
          /* Create City Dropdown Options */
          let city_dropdown_options = [];
          records_city.forEach(function( element, index ){
            let city_dropdown_option = {'label': element.市区町村名.value, 'value': element.市区町村コード.value, 'isDisabled':false};
            city_dropdown_options.push(city_dropdown_option);
          });
    
          /* Create City kintoneUIComponent Objects */
          let citylabel = new kintoneUIComponent.Label({text: '市区町村名'});
          let citydropdown = new kintoneUIComponent.Dropdown({items: city_dropdown_options, value:cityCode_Main_value });
    
          /* Reset City Dropdown on space */
          kintone.app.record.getSpaceElement('space_city').innerHTML = "";
          /* Setting City Dropdown on space */
          kintone.app.record.getSpaceElement('space_city').appendChild(citylabel.render());
          kintone.app.record.getSpaceElement('space_city').appendChild(citydropdown.render());
    
        }, function(error) {
          /* error */
          console.log(error);
        });
      
      }
      
      /* If change Region Dropdown , Insert value '地方名_Main' field . */
      regiondropdown.on('change', function(value_region) {
        //Get_Main app all records include fields on space_region
        let records_Main_region = kintone.app.record.get();
        
        for(let i=0; i<records_region.length; i++){
          if(value_region == records_region[i].地方コード.value){
            records_Main_region['record']['地方名_Main']['value'] = records_region[i].地方名.value;
            records_Main_region['record']['地方コード_Main']['value'] = records_region[i].地方コード.value;
          }
        }
        kintone.app.record.set(records_Main_region);
      });
    }, function(error) {
      console.log(error);
    });
 
   kintone.events.on(['app.record.create.change.地方コード_Main','app.record.edit.change.地方コード_Main'], function(event_region) {
    /* Success */
     /* Get 地方コード_Main field value when 地方コード_Main field change */
     let regioncode_Main = event_region.changes.field;
 
     /* Create prefecture query , use regioncode_Main.value */
     let prefecture_params = {
         "app": CONFIG.PREFECTURE_APP_ID,//都道府県アプリ
         "query":"地方コード="+regioncode_Main.value,
         "fields": ["地方コード","都道府県名","都道府県コード"]
     };

     kintone.api(kintone.api.url('/k/v1/records', true), 'GET', prefecture_params, function(prefecture_resp) {
       /* Success */
       let records_prefecture = prefecture_resp.records;
 
      /* Create Prefecture Dropdown Options */
      let prefecture_dropdown_options = [];
      records_prefecture.forEach(function( element, index ){
        let prefecture_dropdown_option = {'label': element.都道府県名.value, 'value': element.都道府県コード.value, 'isDisabled':false};
        prefecture_dropdown_options.push(prefecture_dropdown_option);
      });
      
      /* Create Prefecture kintoneUIComponent Objects */
      let prefecturelabel = new kintoneUIComponent.Label({text: '都道府県名'});
      let prefecturedropdown = new kintoneUIComponent.Dropdown({items: prefecture_dropdown_options});
 
      /* Reset Prefecture & city Dropdown on space */
      kintone.app.record.getSpaceElement('space_prefecture').innerHTML = "";
      kintone.app.record.getSpaceElement('space_city').innerHTML = "";
      /* Setting Prefecture Dropdown on space */
      kintone.app.record.getSpaceElement('space_prefecture').appendChild(prefecturelabel.render());
      kintone.app.record.getSpaceElement('space_prefecture').appendChild(prefecturedropdown.render());
 
      /* If change prefecture Dropdown , Insert value '都道府県名_Main' field . */
      prefecturedropdown.on('change', function(value_prefecture) {
        //Get_Main app all records include fields on space_prefecture
        let records_Main_prefecture = kintone.app.record.get();

        for(let i=0; i<records_prefecture.length; i++){
          if(value_prefecture == records_prefecture[i].都道府県コード.value){
            records_Main_prefecture['record']['都道府県名_Main']['value'] = records_prefecture[i].都道府県名.value;
            records_Main_prefecture['record']['都道府県コード_Main']['value'] = records_prefecture[i].都道府県コード.value;
          }
        }
        kintone.app.record.set(records_Main_prefecture);
      });
 
     }, function(error) {
       console.log(error);
     });
 
    });
    
    kintone.events.on(['app.record.create.change.都道府県コード_Main','app.record.edit.change.都道府県コード_Main'], function(event_prefecture) {
    /* Success */
     /* Get 都道府県コード_Main value when 都道府県コード_Main change */
     let prefecturecode_Main = event_prefecture.changes.field;

     /* Create city query , use prefecturecode_Main.value */
     let city_params = {
         "app": CONFIG.CITY_APP_ID,//市区町村アプリ
         "query":"都道府県コード="+prefecturecode_Main.value,
         "fields": ["都道府県コード","市区町村名","市区町村コード"]
     };

     kintone.api(kintone.api.url('/k/v1/records', true), 'GET', city_params, function(city_resp) {
       /* Success */
       let records_city = city_resp.records;

      /* Create City Dropdown Options */
      let city_dropdown_options = [];
      records_city.forEach(function( element, index ){
        let city_dropdown_option = {'label': element.市区町村名.value, 'value': element.市区町村コード.value, 'isDisabled':false};
        city_dropdown_options.push(city_dropdown_option);
      });

      /* Create City kintoneUIComponent Objects */
      let citylabel = new kintoneUIComponent.Label({text: '市区町村名'});
      let citydropdown = new kintoneUIComponent.Dropdown({items: city_dropdown_options});

      /* Reset City Dropdown on space */
      kintone.app.record.getSpaceElement('space_city').innerHTML = "";
      /* Setting City Dropdown on space */
      kintone.app.record.getSpaceElement('space_city').appendChild(citylabel.render());
      kintone.app.record.getSpaceElement('space_city').appendChild(citydropdown.render());

      /* If change city Dropdown , Insert value '市区町村名_Main' field . */
      citydropdown.on('change', function(value_city) {
        //Get_Main app all records include fields on space_city
        let records_Main_city = kintone.app.record.get();

        for(let i=0; i<records_city.length; i++){
          if(value_city == records_city[i].市区町村コード.value){
            records_Main_city['record']['市区町村名_Main']['value'] = records_city[i].市区町村名.value;
            records_Main_city['record']['市区町村コード_Main']['value'] = records_city[i].市区町村コード.value;
          }
        }
        kintone.app.record.set(records_Main_city);
        
      });
    }, function(error) {
      console.log(error);
    });

   });
  });/* app.record.create.show app.record.edit.show  */

    kintone.events.on('app.record.detail.show', function(event) {
        kintone.app.record.setFieldShown('地方コード_Main', false);
        kintone.app.record.setFieldShown('都道府県コード_Main', false);
        kintone.app.record.setFieldShown('市区町村コード_Main', false);
    });

})();
/*
Presented By
https://4649-24.com
*/
