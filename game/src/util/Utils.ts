export class Utils {
    
    /**
     * Wait for a specified amount of time
     * @param time Time to wait in milliseconds
     */
    static sleep(time: number) {
        const date = Date.now();
        let currentDate = null;
        do {
            currentDate = Date.now();
        } while (currentDate - date < time);
    }
}