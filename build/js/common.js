'use strict';
/*
 * Functional Programming in JavaScript
 * Chapter 01
 * Magical -run- function in support of Listing 1.1
 * Author: Luis Atencio
 */
// -run- with two functions 
//순수함수. 무상태성(statelessness), 불변성 (immutability)

/*
    부수효과 정리
    - 전역 범위에서 변수, 속성, 자료구조를 변경
    - 함수의 원래 인수 값을 변경
    - 사용자 입력을 처리
    - 예외를 일으킨 해당 함수가 붙잡지 않고(catch) 그대로 예외(throw)를 던짐
    - 화면 또는 로그 파일에 출력
    - HTML 문서, 브라우저 쿠키, DB에 질의
*/

var a = "하이요";

var b = function b(text) {
  return text + ' 랍니다.';
};

console.log('실행 : ', b(a));