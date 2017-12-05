export class KioskMapper {
    
    public static prepareData(data) {
        return data;
    }

    public static prepareListData(res) {
        let result = [];
        let {total, data} = res;
    
        for (let item of data) {
          result.push(KioskMapper.prepareData(item));
        }
        return {total, data: result};
      }
}