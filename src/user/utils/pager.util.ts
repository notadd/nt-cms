import * as _ from 'underscore';
import { Injectable } from '@nestjs/common';

@Injectable()
export class PagerUtil {
    getPager(totalItems, currentPage, pageSize) {
        if (pageSize === undefined || pageSize === 0) {
            pageSize = 1;
        }
        if (currentPage === undefined || currentPage === 0) {
            currentPage = 1;
        }
        const totalPages = Math.ceil(totalItems / pageSize);
        let startPage, endPage;
        if (totalPages <= 10) {
            startPage = 1;
            endPage = totalPages;
        }
        else {
            if (currentPage <= 6) {
                startPage = 1;
                endPage = 10;
            }
            else if (currentPage + 4 >= totalPages) {
                startPage = totalPages - 9;
                endPage = totalPages;
            }
            else {
                startPage = currentPage - 5;
                endPage = currentPage + 4;
            }
        }
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
        const pages = _.range(startPage, endPage + 1);
        return {
            totalItems,
            currentPage,
            pageSize,
            totalPages,
            startPage,
            endPage,
            startIndex,
            endIndex,
            pages
        };
    }
}