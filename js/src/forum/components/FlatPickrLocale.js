const trans = (string) => {
    return app.translator.trans(`fof-polls.forum.calendar.${string}`);
}

const FlatPickrLocale = {
    weekdays: {
        shorthand: [
            trans('sunday.short'),
            trans('monday.short'),
            trans('tuesday.short'),
            trans('wednesday.short'),
            trans('thursday.short'),
            trans('friday.short'),
            trans('saturday.short'),
        ],
        longhand: [
            trans('sunday.long'),
            trans('monday.long'),
            trans('tuesday.long'),
            trans('wednesday.long'),
            trans('thursday.long'),
            trans('friday.long'),
            trans('saturday.long'),
        ],
    },
    months: {
        shorthand: [
            trans('january.short'),
            trans('february.short'),
            trans('march.short'),
            trans('april.short'),
            trans('may.short'),
            trans('june.short'),
            trans('july.short'),
            trans('august.short'),
            trans('september.short'),
            trans('october.short'),
            trans('november.short'),
            trans('december.short'),
        ],
        longhand: [
            trans('january.long'),
            trans('february.long'),
            trans('march.long'),
            trans('april.long'),
            trans('may.long'),
            trans('june.long'),
            trans('july.long'),
            trans('august.long'),
            trans('september.long'),
            trans('october.long'),
            trans('november.long'),
            trans('december.long'),
        ],
    },
    firstDayOfWeek: app.data['fof-polls.first_day_of_week'],
    rangeSeparator: ` ${trans('range_separator')} `,
};

export default FlatPickrLocale;