/*
============================================================================
文件名称	:	LiturgicYear.h
公司		:	CathAssist
作者		:	李亚科
创建时间	:	2014-06-12 12:27
修改时间	:	2014-06-12 12:30
说明		:	用于计算礼仪年
============================================================================
*/
#ifndef __CA_CALENDAR_LITURGIC_YEAR_H__
#define __CA_CALENDAR_LITURGIC_YEAR_H__
#include "LiturgicDay.h"

namespace CathAssist
{
	namespace Calendar
	{   
		class LiturgicYear
		{
		public:
			LiturgicYear(const int& year);
			~LiturgicYear(void);

		public:
            LiturgicDay getLiturgicDay(const Date& d);
			void printSelf();

		private:
			//礼仪年中的关键日期
            LiturgicDay ep;            // Epiphany of the Lord     主受洗日
			LiturgicDay bl;			// End of Christmas season	上一年圣诞期的结束日（主受洗日）
			LiturgicDay aw;			// Ash Wednesday			圣灰礼仪周三（四旬期开始）
            LiturgicDay easter;        // Easter sunday            复活节（主日）
			LiturgicDay ps;			// Pentecost Sunday			圣神降临节（复活期结束）
			LiturgicDay av;			// First Sunday of Advent	将临期第一主日，将临期的开始
            
            int year;           // Current year             当前年份
		};
	}
}

#endif	//__CA_CALENDAR_LITURGIC_YEAR_H__