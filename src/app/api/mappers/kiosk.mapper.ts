export class KioskMapper {
    
    public static prepareData(data) {
        return data;
    }

    public static prepareListData(res) {
        for (let index in res) {
          if (res.hasOwnProperty(index)) {
            res[index] = KioskMapper.prepareData(res[index]);
          }
        }
        return res
      }
}