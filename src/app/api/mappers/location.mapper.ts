export class LocationMapper {
    
      public static prepareData(data) {   
        return data;
      }
    
      public static prepareDataList(res) {
        let result = [];
        let {total, data} = res;
        for (let item of data) {
          result.push(LocationMapper.prepareData(item));
        }
        return {total, data: result};
      }
    }
    