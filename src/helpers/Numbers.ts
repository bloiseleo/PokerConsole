export default abstract class Numbers {
    static iSequence(array: Set<number>): boolean {
        const arr = new Set(array);
        let isSequence: boolean = true;
        let lastNumber: number | undefined = undefined;
        if(arr.size == 1) isSequence = false;
        arr.forEach(v => {
            if(!isSequence) return;
            if(lastNumber == undefined) {
                lastNumber = v;
                return;
            }
            if((v - lastNumber) != 1)  {
                isSequence = false;
            }
            lastNumber = v;
        });
        return isSequence;
    }
}