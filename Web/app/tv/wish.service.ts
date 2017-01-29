﻿import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs/Observable';
//import 'rxjs/Rx';
import {
    WishTextResolverBase,
    WantToHaveTextResolver, WantToLearnTextResolver, WantToBeTextResolver, WantToMakeGiftTextResolver,
    WishResult, WishInput, WishType, WishCallback,
    WishTypeChoice, WantToHaveChoice, WantToLearnChoice, WantToBeChoice, WantToMakeGiftChoice
} from './wish.service.model';

export {
    WishResult, WishInput, WishType, WishCallback,
    WishTypeChoice, WantToHaveChoice, WantToLearnChoice, WantToBeChoice, WantToMakeGiftChoice
};

type WishTextResolversMap = { [key: number]: WishTextResolverBase };

@Injectable()
export class WishService {
    private readonly textResolvers: WishTextResolversMap;
    private readonly notFoundUrl = 'css/img/not-found.jpg';

    constructor(private http: Http) {
        this.textResolvers = this.getTextResolvers();
    }

    private getTextResolvers(): WishTextResolversMap {
        return {
            [WishType.WantToHave]: new WantToHaveTextResolver(),
            [WishType.WantToBe]: new WantToBeTextResolver(),
            [WishType.WantToLearn]: new WantToLearnTextResolver(),
            [WishType.WantToMakeGift]: new WantToMakeGiftTextResolver(),
        }
    }

    private getNotFoundResult(input: WishInput): WishResult {
        return new WishResult(this.notFoundUrl, this.getFailureText(input));
    }

    private getSuccessText(input: WishInput): string {
        return this.textResolvers[input.type].getSuccessText(input);
    }

    private getFailureText(input: WishInput): string {
        return this.textResolvers[input.type].getFailureText(input);
    }

    private raiseResult(resolve: any, result: WishResult) {
        setTimeout(() => resolve(result), 2000);
    }

    getWish(input: WishInput, testMode: boolean = false): Promise<WishResult> {
        return new Promise<WishResult>((resolve: any, reject: any) => {
            if (testMode) {
                this.raiseResult(resolve, new WishResult(this.notFoundUrl, this.getSuccessText(input));
            }
            else {
                let resultItem: WishResult;
                let searchText = encodeURIComponent(input.searchText);
                //let url =
                //    `https://www.googleapis.com/customsearch/v1?key=AIzaSyC1n9wpvVqUDUCyN4G9zwmUeZhmSHR0Oaw` +
                //    `&cx=007634069652725397483:o1ur-qeu6tc&searchType=image&q=${searchText}`;

                let url = `https://pixabay.com/api/?key=4077546-5b7acad1ea019ee9cec49f73f&q=${searchText}`;

                this.http.get(url)
                    .map((data: any) => data.json())
                    .subscribe((data: any) => {
                        if (data.hits && data.hits.length > 0) {
                            let index = Math.floor(Math.random() * Math.min(20, data.totalHits));
                            resultItem = new WishResult(data.hits[index].webformatURL, this.getSuccessText(input));
                        } else {
                            resultItem = this.getNotFoundResult(input);
                        }
                    },
                    () => {
                        this.raiseResult(resolve, this.getNotFoundResult(input));
                    },
                    () => {
                        this.raiseResult(resolve, resultItem);
                    });
            }
        });
    }
}