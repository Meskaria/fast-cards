const addLessConfig = (rules) => {
  return {
    ...rules[1],
    oneOf: rules[1].oneOf.map((rule) => {
      const use = rule.use.map((use) => {
        if (use.loader === 'less-loader') {
          return {
            ...use,
            options: {
              ...use.options,
              modifyVars: {
                '@primary-color': '#ba80a3',
                '@success-color': '#2ed573',
                '@info-color': '#ba80a3',
                '@error-color': '#ff4757',
                '@disabled-color': '#788995',
                '@font-family': "'Open Sans', sans-serif",
                '@border-radius-base': '3px',
                '@heading-color': '#0d1a26',
                '@text-color': '#0d1a26',
                '@font-size-base': '16px',
                '@table-header-bg': 'transparent',
                '@table-padding-vertical': '18px',
                '@table-padding-horizontal': '22px',
                '@table-row-hover-bg': 'transparent',
                '@tag-default-bg': '#f3f4f4',
                '@tag-default-color': '#0d1a26',
                '@tag-font-size': '14px',
                '@btn-font-weight': 500,
                '@btn-height-base': '40px',
                '@tooltip-bg': 'rgba(13, 26, 38, .9)',
                '@collapse-content-padding': '5px 0px 5px 57px',
                '@tabs-ink-bar-color': 'transparent',
                '@tabs-horizontal-margin': '0',
                '@tabs-horizontal-padding': '12px 0',
                '@btn-padding-lg': '15px 25px',
                '@btn-font-size-lg': '14px',
                '@btn-height-lg': '48px',
                '@input-border-color': '#dde0e6',
                '@input-color': '#0d1a26',
                '@input-height-base': '50px',
                '@input-height-lg': '40px',
                '@input-height-sm': '40px',
                '@input-hover-border-color': '#ba80a3',
                '@form-vertical-label-padding': '0',
                '@form-item-margin-bottom': '12px',
                '@label-color': '#6b7790',
                '@tabs-bar-margin': '0',
                '@table-selected-row-bg': '#f5f7fb',
                '@table-expanded-row-bg': 'transparent',
                '@switch-color': '#2ed573',
                // The background colors for active and hover states for things like
                // list items or table cells.
                '@item-active-bg': '#f5f7fb',
                '@item-hover-bg': '#f5f7fb',
                '@line-height-base': '1.42857143',
                '@text-selection-bg': '#f5f7fb',
                '@skeleton-color': '#eceff3',
              },
            },
          };
        }

        return use;
      });
      return {
        ...rule,
        use,
      };
    }),
  };
};

module.exports = (config) => {
  return {
    ...config,
    module: {
      ...config.module,
      rules: [
        config.module.rules[0],
        addLessConfig(config.module.rules),
        ...config.module.rules.slice(2),
      ],
    },
  };
};
