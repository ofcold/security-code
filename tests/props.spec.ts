import { mount } from '@vue/test-utils';
import SecurityCode from '../src';

describe('props', () => {
  describe('modelValue', () => {
    it('should apply the given modelValue', () => {
      const wrapper = mount(SecurityCode, {
        props: {
          modelValue: '123456',
        },
      });

      expect(wrapper.props('modelValue')).toEqual('123456');
    });
  });

  describe('blurOnComplete', () => {
    it('should not be blurOnComplete by false', () => {
      const wrapper = mount(SecurityCode);

      expect(wrapper.props('blurOnComplete')).toBe(false);
    });

    it('should be blurOnComplete', () => {
      const wrapper = mount(SecurityCode, {
        props: {
          blurOnComplete: true,
        },
      });

      expect(wrapper.props('blurOnComplete')).toBe(true);
    });
  });

  describe('len', () => {
    it('should not display the len by default', () => {
      const wrapper = mount(SecurityCode);

      expect(wrapper.props('len')).toBe(6);
    });

    it('should display the len four', () => {
      const wrapper = mount(SecurityCode, {
        props: {
          len: 4,
        },
      });

      expect(wrapper.props('len')).toBe(4);
    });
  });

  describe('isArray', () => {
    it('should not be isArray by false', () => {
      const wrapper = mount(SecurityCode, {
        props: {
          isArray: false,
        },
      });

      expect(wrapper.props('isArray')).toBe(false);
    });

    it('should by isArray', () => {
      const wrapper = mount(SecurityCode, {
        props: {
          isArray: true,
        },
      });

      expect(wrapper.props('isArray')).toBe(true);
    });
  });

  describe('size', () => {
    it('should not be size by default', () => {
      const wrapper = mount(SecurityCode);

      expect(wrapper.props('size')).toBe('default');
    });

    it('should be size by md', () => {
      const wrapper = mount(SecurityCode, {
        props: {
          size: 'md',
        },
      });

      expect(wrapper.props('size')).toBe('md');
    });
  });
});
