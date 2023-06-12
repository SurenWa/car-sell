import { rm } from "fs/promises";
import { join } from "path";
import { DataSource} from 'typeorm';

global.beforeEach(async () => {
    try {
        await rm(join(__dirname, '..', 'test.sqlite'))
    } catch (error) {
        
    }    
});

// global.afterEach(async () => {
//     const conn = await DataSource()
//     await conn.close
// })