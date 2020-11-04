import axios from 'axios'
import {baseURL} from '../config';

export default class Search {
  constructor(query){
    this.query = query;
  }
  
  async getResults(){
    try{
      const res = await axios(baseURL+`search?q=${this.query}`);
      
      this.result = res.data.recipes;

      // console.log(this.result);

    }catch(err){
      console.log(err);
    }
  }

}

