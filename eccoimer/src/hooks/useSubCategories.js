import axios from "axios";
import { useCallback } from 'react';
export function useSubCategories() {
  const getsubCat = async () => {
    try {
      const response = await axios.get(`http://localhost:3000/restorex/subcategories/getAllSubcategories`);
      console.log(response.data.getAllSubcategories);
      const data = response.data
      console.log(data);

      return data;

    }


    catch (err) {
      console.log(err);

    }

  };

  const listSubCategories = useCallback(async (categoryId) => {
    try {
      const response = await axios.get(`http://localhost:3000/restorex/categories/${categoryId}/subcategories/getALLSubCAtegories`);
      debugger
      const data = response.data.getAllSubCategories;
      console.log(data);
      return data;
    } catch (err) {
      console.log(err);
    }
  }, []);
  return { getsubCat, listSubCategories };
}